# -*- coding: utf-8 -*-
"""
sequencer.py – Satz-Sequenzierung + Klassifikation (DE) – v6.2 (Round-3)

▶ Zweck (kurz):
    Analysiert deutschen Fließtext satzweise mit spaCy und klassifiziert jeden Satz als
    Hypotaxe (Nebensatz enthalten), Parataxe (Nebenordnung), Hauptsatz, Fragesatz,
    Aufforderungssatz (Imperativ), Ausrufesatz oder Ellipse. Zusätzlich werden
    erkannte Einleitewörter (NS‑Marker) gesammelt.

▶ Pipeline (high-level):
    1) Text → spaCy-Dokument → spaCy teilt in Sätze (doc.sents).
    2) Für jeden Satz:
       - Zähle finite Verben (VerbForm=Fin) → Filter für Ellipsen.
       - Erkenne Frage-/Ausrufezeichen → *Frage/Ausruf*.
       - Erkenne Infinitivsätze ("um ... zu <Inf>", Komma+"zu <Inf>").
       - Erkenne V1‑Konditionalsätze (Verb an Position 1, finites Verb nach Komma).
       - Erkenne Imperativ (Morph Mood=Imp) und einen robusten Fallback.
       - Sammle NS‑Marker am Satzanfang und an beliebiger Position (eingeschoben),
         inkl. SCONJ ("dass", "weil", ...) und echte Relativpronomen (PronType=Rel).
       - Erkenne Parataxe über echte Koordination zweier finiter Prädikate.
       - Sonst: *Hauptsatz*.
    3) Aggregiere Verteilung der Satzarten + Häufigkeit der NS‑Marker.

▶ Wichtige linguistische Begriffe (non‑linguist‑friendly):
    - *Fin. Verb* = flektiertes Verb mit Personalendung (z.B. "geht", "hat").
    - *Hypotaxe* = Unterordnung mit Nebensatz (oft eingeleitet durch Wörter wie
      "dass", "weil", "wenn", Relativpronomen wie "der/die/das" in Relativ-Funktion).
    - *Parataxe* = Nebenordnung (Sätze gleicher Rangstufe) – oft mit "und/aber/oder".
    - *Relativpronomen* = verweisen rückwirkend auf ein Nomen ("der Mann, *der* ...").
    - *V1‑Konditional* = konditionale Struktur mit Verb an erster Stelle und einem
      nachgestellten, kommagetrennten zweiten finiten Verb („Geht er, so folgt ...“).
    - *Infinitivsatz* = Konstruktion mit "um/ohne/anstatt ... zu <Infinitiv>".

▶ Stabilitäts-/Präzisionsnotizen:
    - Wir verlassen uns bewusst auf Morphologie (spaCy) statt reinen Wortlisten,
      z.B. für Relativpronomen via PronType=Rel (um "das"=Artikel vs. "dass"=SCONJ zu trennen).
    - Parataxe verlangt zwei FINITE Prädikate in Koordination, um Adjektiv-/NP‑Ketten
      mit "und" nicht fälschlich als Parataxe zu kennzeichnen.

▶ Verbesserungs-/Erweiterungsideen (Backlog):
    - Feinere Unterscheidung von Fragesatztypen (W‑Frage, Entscheidungsfrage, Ergänzungsfrage).
    - Nebensatz‑Typisierung (kausal, konditional, temporal, relativ, final, modal ...)
      auf Basis des Markers + Dependenzstruktur.
    - Robustere V1‑Konditional‑Erkennung für lange Vorfelder / Inversion.
    - Besseres Handling von wörtlicher Rede und Parenthesen.
    - Satzsplit‑Tuning (custom sentencizer rules) für Abkürzungen, Zitate, Headlines.
    - Konfig‑Schalter (CLI‑Flags) für strenge vs. tolerante Heuristiken.

Fixes ggü. v6.1:
- Infinitivsatz-Erkennung robuster:
  * 'um ... zu <Inf>' auch am SATZANFANG (kein Komma davor nötig).
  * ', zu <Inf>' bleibt unterstützt.
- Relativ-/NS-Marker präziser:
  * REL-Pronomen nur, wenn Morphology PronType=Rel und POS != DET.
  * 'dass' (SCONJ) wird weiter als NS-Marker gewertet, 'das/die' als Artikel nicht.
- Imperativ-Fallback kollidiert nicht mit V1-Konditional:
  * Greift NICHT, wenn ein Komma + weiteres finites Verb vorhanden ist (klassisches V1-Konditional).
"""

import sys, re, json
from dataclasses import dataclass, asdict
from collections import Counter
from typing import List, Tuple, Dict, Any, Optional

import spacy
from spacy.tokens import Doc, Span, Token
from spacy.symbols import VERB, AUX, CCONJ


def _load_model(name: str = "de_core_news_lg"):
    """Lädt das deutsche spaCy‑Modell.

    Warum lg? → bessere Vektoren/Tags; austauschbar (sm/md) falls Ressourcen knapp.
    Fehlerfall: gibt klare Installationsanweisung aus.
    """
    try:
        return spacy.load(name)
    except OSError:
        raise SystemExit(
            f"spaCy-Modell '{name}' fehlt.\n"
            f"Installiere via: python -m spacy download {name}"
        )


# Globales nlp – für Performance sinnvoll, da das Modell groß ist.
nlp = _load_model()

# Lexikon typischer Koordinatoren – unterstützt Parataxe-Heuristik.
KOORD = {"und","oder","aber","doch","sondern","bzw."}

# Unterordnende Konjunktionen (SCONJ) – als *Kandidaten* für NS‑Marker am Anfang
# oder nach Komma. Die tatsächliche Verifikation berücksichtigt ein folgendes
# finites Verb (Heuristik gegen false positives).
SCONJ_LIKE = {
    "dass","weil","wenn","obwohl","damit","während","als","seit","nachdem",
    "ob","sofern","sodass","falls","bevor","bis","indem","wie","wodurch",
    "sobald","da","ehe","warum","weshalb","weswegen","wozu","wofür","um",
    "anstatt","ohne"
}

# Relativpronomen: nur *Kandidaten*. Echte Erkennung via Morph PronType=Rel und POS != DET.
REL_PRON_CANDIDATES = {
    "der","die","das","dessen","deren","dem","den","welcher","welche","welches",
    "wem","wen","wo","wohin","wonach","woran","worauf","wodurch","womit","wovon",
    "worüber","woraus","worum","worin","wobei","was","wer"
}


def txt(x: Any) -> str:
    """Hilfsfunktion: robust Text extrahieren (Doc/Span/str)."""
    if isinstance(x,(Doc,Span)): return x.text
    if isinstance(x,str): return x
    return str(x)


def doc_of(x: Any) -> Doc:
    """Hilfsfunktion: sorgt dafür, dass wir mit einem spaCy-Doc arbeiten."""
    if isinstance(x,Doc): return x
    if isinstance(x,Span): return nlp(x.text)
    return nlp(txt(x))


def count_finite_verbs(s: Any) -> int:
    """Zählt finite Verben in einem Satz (VerbForm==Fin)."""
    d = doc_of(s)
    return sum(1 for t in d if t.pos in (VERB, AUX) and t.morph.get("VerbForm")==["Fin"])


def _first_comma_and_after(d: Doc) -> Tuple[int, Optional[Token], bool]:
    """Findet erstes Komma, Token danach und prüft, ob dieses ein finites Verb ist.
    Nützlich u.a. für V1‑Konditional und NS‑Erkennung am Satzanfang.
    Rückgabe: (Kommaindex, Token_nach_Komma, ist_finites_Verb_nach_Komma)
    """
    comma_idx = next((i for i,t in enumerate(d) if t.text == ","), -1)
    tok_after = d[comma_idx+1] if (comma_idx!=-1 and comma_idx+1 < len(d)) else None
    is_v2 = bool(tok_after and tok_after.pos in (VERB, AUX) and tok_after.morph.get("VerbForm")==["Fin"])
    return comma_idx, tok_after, is_v2


# ---- NS-Marker am Satzanfang
def get_subordinate_markers_start(s: Any) -> List[str]:
    """Erkennt Nebensatz‑Marker am *Satzanfang*.
    Heuristik:
      - Erstes Token ist SCONJ (z.B. "weil", "dass") → Marker; zusätzlich fordern wir
        entweder ein finites Verb nach dem ersten Komma (klassische NS‑Struktur) *oder*
        die Sonderlogik für "um ... zu" (Finalsatz) am Satzanfang.
      - V1‑Konditional: Verb an 1, später nach dem Komma wieder finites Verb → Marker.
      - "als/wie" (uneingeleitete NS) bei Verb nach Komma.
    """
    d = doc_of(s)
    if not len(d): return []
    markers: List[str] = []
    first = d[0]
    _, _, is_v2 = _first_comma_and_after(d)

    if first.lower_ in SCONJ_LIKE:
        if is_v2 or first.lower_ in {"um"}:  # 'um ... zu' kann am Satzanfang sein
            markers.append(first.lower_)

    # V1-Konditional (Verb an 1, finites Verb nach Komma)
    if first.pos in (VERB, AUX) and first.morph.get("VerbForm")==["Fin"] and is_v2:
        if first.morph.get("Mood") != ["Imp"]:
            markers.append("V1-Konditional")

    # Als/Wie uneingeleitet
    if first.lower_ in {"als","wie"} and is_v2:
        markers.append(first.lower_ + "-NS")

    return list(dict.fromkeys(markers))


# ---- Eingeschobene Nebensätze (ANYWHERE)
def get_subordinate_markers_anywhere(s: Any) -> List[str]:
    """Erkennt *eingeschobene* Nebensätze (durch Kommata abgetrennt).
    Logik:
      - SCONJ ("weil", "dass", ...) nach einem Komma + bald folgendem finiten Verb.
      - Relativpronomen nur, wenn Morph PronType=Rel und POS != DET (Artikelfall
        ausschließen), ebenfalls nach einem Komma.
    """
    d = doc_of(s)
    if not len(d): return []
    markers: List[str] = []
    comma_positions = {i for i,t in enumerate(d) if t.text == ","}

    for i,t in enumerate(d):
        low = t.lower_

        # SCONJ wie 'weil', 'dass', ...
        if low in SCONJ_LIKE and any(ci <= i for ci in comma_positions):
            if any(x.pos in (VERB, AUX) and x.morph.get("VerbForm")==["Fin"] for x in d[i+1:i+10]):
                markers.append(low)

        # Relativpronomen NUR wenn tatsächlich Rel-Form (Morph) und kein DET
        if (low in REL_PRON_CANDIDATES
            and t.pos_ != "DET"
            and "Rel" in "".join(t.morph.get("PronType"))
            and any(ci <= i for ci in comma_positions)):
            markers.append(low)

    return list(dict.fromkeys(markers))


# ---- Infinitivsatz
def is_infinitive_clause(s: Any) -> Tuple[bool,str]:
    """Erkennt Infinitivkonstruktionen:
        - "um ... zu <Inf>" (auch am Satzanfang)
        - Komma+"zu <Inf>" (klassischer Einschub), toleriert auch ohne explizites Komma
    Liefert (True, Label) bzw. (False, "").
    """
    d = doc_of(s)
    # 'um ... zu <Inf>' – AM ANFANG ODER nach Komma
    for i, tok in enumerate(d):
        if tok.lower_ == "um":
            # suche 'zu <Inf>' hinter 'um'
            if any(d[j].lower_=="zu" and j+1 < len(d) and d[j+1].morph.get("VerbForm")==["Inf"]
                   for j in range(i+1, min(i+10, len(d)))):
                return True, "Infinitivsatz (um zu)"
    # ', zu <Inf>' ohne 'um'
    for i, tok in enumerate(d):
        if tok.lower_ == "zu" and i+1 < len(d) and d[i+1].morph.get("VerbForm")==["Inf"]:
            # optionales Komma vorher (klassischer Einschub) – falls keins: trotzdem zulassen
            return True, "Infinitivsatz (zu)"
    return False, ""


# ---- Parataxe
def has_true_coordination(s: Any) -> bool:
    """Erkennt echte Koordination zweier finiter Prädikate (Parataxe).
    Schutz vor False Positives:
      - Wir verlangen *conj*-Abhängigkeit eines finiten (VERB/AUX) unter einem Koordinator
        (POS=CCONJ oder aus KOORD‑Set).
      - Alternativ: Semikolon + ≥2 finite Verben.
      - Alternativ: Komma + Koordinator (und/oder/aber/...) *ohne* vorhandene NS‑Marker,
        dann prüfen: sind ≥2 finite Verben vorhanden?
    """
    d = doc_of(s); t = txt(s)
    for token in d:
        if token.pos == CCONJ or token.lower_ in KOORD:
            for child in token.children:
                if child.dep_ == "conj" and child.pos in (VERB, AUX) and child.morph.get("VerbForm")==["Fin"]:
                    return True
    if ";" in t and count_finite_verbs(d) >= 2:
        return True
    if not (get_subordinate_markers_start(d) or get_subordinate_markers_anywhere(d)):
        if re.search(r",\s*(und|oder|aber|doch|sondern)\b", t, flags=re.IGNORECASE):
            return count_finite_verbs(d) >= 2
    return False


# ---- Imperativ (streng + Fallback)
def is_imperative_strict(d: Doc) -> bool:
    """Strenge Imperativ‑Erkennung über Morphologie (Mood=Imp)."""
    for token in d:
        if token.pos == VERB and token.morph.get("VerbForm")==["Fin"] and token.morph.get("Mood")==["Imp"]:
            return True
    return False


def is_v1_conditional(d: Doc) -> bool:
    """Erkennt V1‑Konditionale: Verb an 1, Komma, danach wieder finites Verb."""
    if not len(d): return False
    first = d[0]
    if not (first.pos in (VERB, AUX) and first.morph.get("VerbForm")==["Fin"]):
        return False
    comma_idx, _, is_v2 = _first_comma_and_after(d)
    return comma_idx != -1 and is_v2


def is_imperative_fallback(d: Doc) -> bool:
    """Fallback‑Heuristik für Imperativ ohne explizites Mood=Imp.
    Sicherheitsschienen:
      - NIE anwenden bei erkanntem V1‑Konditional (würde kollidieren).
      - Nur in Aussagesätzen (keine Fragezeichen).
      - Verb am Anfang (oder Tag beginnt mit 'V') *ohne* voranstehendes Subjekt.
    """
    # NICHT anwenden, wenn V1-Konditional-Muster erkennbar
    if is_v1_conditional(d): 
        return False
    if not len(d) or "?" in d.text: 
        return False
    first = d[0]
    if first.pos in (VERB, AUX) or (first.tag_ and first.tag_.startswith("V")):
        # kein Subjekt vor dem ersten Verb
        if not any(t.dep_=="nsubj" and t.i < first.i for t in d):
            return True
    return False


# ---- Klassifikation
def classify_sentence(s: Any) -> Tuple[str,List[str]]:
    """Kernklassifikator in sinnvoller Prüf-Reihenfolge (kurz erklärt):
      1) Leere/elliptische Sätze herausfiltern (keine finiten Verben → Ellipse).
      2) *Frage* vorziehen ("?" gewinnt), Marker trotzdem melden.
      3) *Infinitivsatz* früh greifen lassen (um klare Fälle nicht zu überschreiben).
      4) V1‑Konditional markieren (vor Imperativ‑Fallback, um Kollision zu vermeiden).
      5) *Aufforderung* (Imperativ streng oder Fallback), Marker weiterreichen.
      6) *Ausruf* ("!"), Marker weiterreichen.
      7) NS‑Marker aggregieren → Hypotaxe, falls vorhanden.
      8) Parataxe (echte Koordination) prüfen.
      9) Sonst: Hauptsatz.
    """
    d = doc_of(s); t = txt(d).strip()
    if not t: return "Ellipse", []
    fin = count_finite_verbs(d)
    if fin == 0: return "Ellipse", []

    if "?" in t:
        m = get_subordinate_markers_start(d) + get_subordinate_markers_anywhere(d)
        return "Fragesatz", list(dict.fromkeys(m))

    # ZUERST: Infinitivsatz
    has_inf, inf_label = is_infinitive_clause(d)
    if has_inf:
        return "Infinitivsatz", [inf_label]

    # V1-Konditional explizit markieren (vor Imperativ-Fallback)
    if is_v1_conditional(d):
        m = get_subordinate_markers_start(d) + get_subordinate_markers_anywhere(d)
        return "Hypotaxe", list(dict.fromkeys(["V1-Konditional"] + m))

    # Imperativ (streng oder fallback)
    if is_imperative_strict(d) or is_imperative_fallback(d):
        m = get_subordinate_markers_start(d) + get_subordinate_markers_anywhere(d)
        return "Aufforderungssatz", list(dict.fromkeys(m))

    if "!" in t:
        m = get_subordinate_markers_start(d) + get_subordinate_markers_anywhere(d)
        return "Ausrufesatz", list(dict.fromkeys(m))

    m_start = get_subordinate_markers_start(d)
    m_any = get_subordinate_markers_anywhere(d)
    markers_all = list(dict.fromkeys(m_start + m_any))
    if markers_all:
        return "Hypotaxe", markers_all

    if has_true_coordination(d):
        return "Parataxe", []

    return "Hauptsatz", []


# ---- Datenstruktur & Analyse
@dataclass
class SentenceAnalysis:
    index: int
    text: str
    label: str
    intro: List[str]
    start: int
    end: int


def analyze_text(raw_text: str):
    """Komfortfunktion für CLI‑Report: iteriert über doc.sents und baut
    eine geordnete Liste von Satzanalysen + Zusammenfassung + NS‑Marker‑Statistik.
    """
    doc = nlp(raw_text)
    results, counts, intro_counts = [], Counter(), Counter()
    idx = 0
    for sent in doc.sents:
        clean = sent.text.strip()
        if not clean: continue
        idx += 1
        label, markers = classify_sentence(sent)
        counts[label] += 1
        intro_counts.update(markers)
        results.append(asdict(SentenceAnalysis(
            index=idx, text=clean, label=label, intro=markers,
            start=sent.start_char, end=sent.end_char
        )))
    total = sum(counts.values()) or 1
    order = ["Hypotaxe","Parataxe","Hauptsatz","Fragesatz","Aufforderungssatz","Ausrufesatz","Ellipse"]
    summary_lines = ["\nVerteilung Satzarten:"]
    for k in order:
        v = counts.get(k,0); pct = 100.0*v/total
        summary_lines.append(f"- {k:<20}: {v:2d} / {total} → {pct:5.1f} %")
    intro_lines = ["\nEinleitewörter (nur bei NS):"]
    if intro_counts:
        for w,c in sorted(intro_counts.items(), key=lambda x:(-x[1], x[0])):
            intro_lines.append(f"- {w:<11}: {c}")
        intro_lines.append(f"\nVerschiedene Einleitewörter: {len(intro_counts)}")
    else:
        intro_lines.append("(keine)")
    return results, "\n".join(summary_lines), "\n".join(intro_lines)


def analyze_to_json(raw_text: str) -> Dict[str,Any]:
    """Maschinenfreundliche JSON‑Variante der Analyse (ohne hübschen Report)."""
    doc = nlp(raw_text)
    sentences, dist, intro = [], Counter(), Counter()
    idx = 0
    for sent in doc.sents:
        clean = sent.text.strip()
        if not clean: continue
        idx += 1
        label, markers = classify_sentence(sent)
        dist[label] += 1; intro.update(markers)
        sentences.append(SentenceAnalysis(
            index=idx, text=clean, label=label, intro=markers,
            start=sent.start_char, end=sent.end_char
        ))
    return {
        "sentences":[asdict(s) for s in sentences],
        "distribution": dict(dist),
        "intro_counts": dict(intro)
    }


def print_report(results, summary, intro):
    """CLI‑Report (Textausgabe) – bewusst schlicht gehalten für Pipes/Logs."""
    print("\n" + "="*50)
    print("      SEQUENCER.PY ANALYSE-REPORT (v6.2)")
    print("="*50)
    print("\nSätze:")
    for r in results:
        intro_list = ", ".join(r["intro"]) if r["intro"] else "—"
        print(f"{r['index']:>2}) {r['text']}\n  → {r['label']} | Einleitewörter: {intro_list}")
    print(summary); print(intro); print("\n" + "="*50 + "\n")


# ---- CLI

def _read_stdin() -> str:
    """Liest gesamte STDIN (für Pipe‑Nutzung)."""
    data = sys.stdin.read()
    return data if data is not None else ""


def _parse_args(argv: List[str]) -> Tuple[Optional[str], bool]:
    """Minimal‑Parser für zwei Modi:
        - Datei übergeben:  python sequencer.py text.txt
        - STDIN + optional --json: echo "Text" | python sequencer.py --json
    Unbekannte Optionen werden nur geloggt, nicht als Fehler gewertet.
    """
    args = [a for a in argv[1:] if a.strip()]
    json_flag, file_arg = False, None
    for a in args:
        if a == "--json": json_flag = True
        elif a.startswith("--"): print(f"Ignoriere unbekannte Option: {a}")
        else: file_arg = a
    return file_arg, json_flag


if __name__ == "__main__":
    # CLI‑Entry: liest Text (Datei oder STDIN) und gibt Report oder JSON aus.
    file_arg, json_flag = _parse_args(sys.argv)
    if file_arg:
        try:
            with open(file_arg, "r", encoding="utf-8") as f:
                raw_text = f.read()
        except FileNotFoundError:
            print(f"Fehler: Datei '{file_arg}' nicht gefunden.", file=sys.stderr)
            sys.exit(1)
    else:
        raw_text = _read_stdin()

    if not raw_text.strip():
        print("Bitte Text via Datei angeben:  python sequencer.py examples.txt")
        print("oder per Pipe:                 echo \"Text\" | python sequencer.py")
        print("Optional JSON:                 echo \"Text\" | python sequencer.py --json")
        sys.exit(0)

    if json_flag:
        print(json.dumps(analyze_to_json(raw_text), ensure_ascii=False, indent=2))
    else:
        res, summ, intro = analyze_text(raw_text)
        print_report(res, summ, intro)
