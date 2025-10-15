import subprocess
from flask import Flask, render_template, request, jsonify
from sentence_transformers import SentenceTransformer, util
# NEU: Wir importieren die Analysefunktion aus unserer sequencer.py Datei
from sequencer import analyze_to_json

# --- Initialisierung ---
# Initialisiere die Flask-App
app = Flask(__name__, template_folder='.')

# Lade das SBERT-Modell. Das kann beim ersten Start etwas dauern.
# Dieses Modell wird im Speicher gehalten, um bei Anfragen schnell zu sein.
print("Lade SBERT-Modell...")
sbert_model = SentenceTransformer('all-MiniLM-L6-v2')
print("SBERT-Modell geladen.")


# --- Platzhalter-Funktionen für deine Logik ---
# HINWEIS: Diese Funktion wird jetzt mit der echten Sequencer-Logik befüllt.
def analyze_with_sequencer(text):
    """
    Analysiert die Satzstruktur, indem sie die externe sequencer.py aufruft.
    """
    try:
        # Rufe die JSON-Analysefunktion aus dem Sequencer-Modul auf
        data = analyze_to_json(text)

        # Bereite eine einfache Zusammenfassung für das Frontend auf
        distribution = data.get("distribution", {})
        total_sentences = sum(distribution.values())
        
        if total_sentences == 0:
            return {
                "score": 0,
                "details": "Keine Sätze gefunden.",
                "message": "Die Sequencer-Analyse war erfolgreich."
            }

        # Beispiel-Score: Prozentanteil der Hypotaxen (komplexe Sätze)
        hypotaxe_count = distribution.get("Hypotaxe", 0)
        score = round((hypotaxe_count / total_sentences) * 100, 1)

        # Details: Eine kurze Zusammenfassung der Satztypen
        details = ", ".join(f"{k}: {v}" for k, v in distribution.items())

        return {
            "score": f"{score}%",
            "details": f"{total_sentences} Sätze. Verteilung: {details}",
            "message": "Die Sequencer-Analyse war erfolgreich."
        }
    except Exception as e:
        print(f"Fehler in der Sequencer-Analyse: {e}")
        return {"error": "Sequencer-Analyse fehlgeschlagen.", "details": str(e)}


def check_with_vale(text):
    """
    Führt den Vale-CLI-Befehl für einen gegebenen Text aus.
    Stellt sicher, dass Vale im Systempfad verfügbar ist (wie im Dockerfile).
    """
    try:
        # Führe Vale als externen Prozess aus.
        # Das Ergebnis wird als JSON ausgegeben, was die Verarbeitung erleichtert.
        # Du musst eventuell den Pfad zur .vale.ini Konfigurationsdatei anpassen.
        result = subprocess.run(
            ['vale', '--output=JSON', 'text.txt'], # Annahme: Text wird temporär gespeichert oder per stdin übergeben
            input=text,
            text=True,
            capture_output=True,
            check=True
        )
        # Parse das JSON-Ergebnis
        vale_output = result.stdout
        return {
            "score": len(vale_output.splitlines()), # Beispiel: Score ist die Anzahl der Meldungen
            "details": vale_output,
            "message": "Vale-Check erfolgreich."
        }
    except FileNotFoundError:
        print("Fehler: 'vale' Kommando nicht gefunden.")
        return {"error": "Vale ist nicht installiert oder nicht im PATH."}
    except subprocess.CalledProcessError as e:
        print(f"Vale-Fehler: {e.stderr}")
        return {"error": "Fehler bei der Ausführung von Vale.", "details": e.stderr}


# --- API-Endpunkte ---
@app.route('/')
def index():
    """
    Liefert die Hauptseite (das Frontend) aus.
    """
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    """
    Ein zentraler API-Endpunkt, der alle Analysen durchführt.
    """
    data = request.json
    text1 = data.get('text1', '')
    text2 = data.get('text2', '')

    if not text1:
        return jsonify({"error": "Text 1 darf nicht leer sein."}), 400

    # 1. SBERT Ähnlichkeitsanalyse (Inhalt)
    sbert_result = {}
    if text2:
        try:
            embedding1 = sbert_model.encode(text1, convert_to_tensor=True)
            embedding2 = sbert_model.encode(text2, convert_to_tensor=True)
            cosine_score = util.pytorch_cos_sim(embedding1, embedding2).item()
            sbert_result = {
                "score": round(cosine_score, 4),
                "message": "Die Texte haben eine Ähnlichkeit von " + str(round(cosine_score * 100, 2)) + "%."
            }
        except Exception as e:
            sbert_result = {"error": f"SBERT-Analyse fehlgeschlagen: {e}"}
    else:
        sbert_result = {"score": 0, "message": "Bitte gib einen zweiten Text für die Ähnlichkeitsanalyse ein."}


    # 2. Sequencer & Vale Analyse (Ausdruck) für Text 1
    sequencer_result = analyze_with_sequencer(text1)
    vale_result = check_with_vale(text1) # Du musst hier deine Vale-Regeln konfigurieren!

    # Kombiniere die Ergebnisse und sende sie zurück
    return jsonify({
        'sbert': sbert_result,
        'sequencer': sequencer_result,
        'vale': vale_result
    })

# --- Server starten ---
if __name__ == '__main__':
    # Starte den Server im Debug-Modus.
    # Für eine Produktivumgebung würdest du einen WSGI-Server wie Gunicorn verwenden.
    app.run(host='0.0.0.0', port=5001, debug=True)

