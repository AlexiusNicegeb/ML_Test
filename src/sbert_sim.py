# sbert_sim.py
# pip install -U sentence-transformers
# python sbert_sim.py

from sentence_transformers import SentenceTransformer, util
import re

MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

def clean(text: str) -> str:
    # Bullets/Sonderzeichen glätten, Whitespaces normalisieren
    text = (text.replace("■", " ")
                .replace("—", " ")
                .replace("–", "-")
                .replace("„", "\"")
                .replace("“", "\""))
    text = re.sub(r"[•■▪▼►▶◆◇✓✔✗✘→·]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

text1 = clean("""Das Lesen stirbt aus. Und wir sind es, die es zur Strecke bringen. Genauer gesagt: unsere „neuen Technologien“ und unsere „alte Ignoranz“. Es hat einen Wandel hin zur bildhaften Kommunikation gegeben – Menschen schauen lieber Videos, anstatt Bücher zu lesen. Gleichzeitig wird dieser Wandel stillschweigend akzeptiert, Verantwortliche gehen nicht dagegen vor.""")

text2 = clean("""Das Lesen, die wichtigste Kulturtechnik des Menschen, ist von zwei Seiten gefährdet:
■ „neue Technologie“: Nach Textnachrichten (SMS, Whats-app …) werden nun Kommunikationsmittel, die der gesprochenen Sprache den Vorzug geben, wie Sprachnachrichten und Videos sowie digitale Sprachassistenten, intensiv genutzt. Diese Technologien verhindern eine tiefergehende Auseinandersetzung mit Geschriebenem, da das Senden von Gesprochenem im Vordergrund steht.
■ „alte Ignoranz“: Die zweite Gefährdung des Lesens geht von der Bildungspolitik aus, die die zunehmenden Lesedefizite von Menschen und die sinkende Bedeutung des (Vor-) Lesens ignoriert, statt dieser Entwicklung entgegenzuwirken und das Lesen zu fördern.
Statt in Kulturpessimismus zu verfallen, sollte die Krise des Lesens genutzt werden, um diese Kulturtechnik wieder auf ihre eigentliche Stärke zurückzuführen, durch Aktionen und Veranstaltungen, die das Lesen feiern.""")

def main():
    print("Lade Modell:", MODEL_NAME)
    model = SentenceTransformer(MODEL_NAME)

    emb1 = model.encode(text1, normalize_embeddings=True)
    emb2 = model.encode(text2, normalize_embeddings=True)

    score = util.cos_sim(emb1, emb2).item()  # 0..1

    print("\n--- Texte ---")
    print("Text 1:", text1)
    print("Text 2:", text2)

    print("\n--- Ergebnis ---")
    print(f"Cosine-Ähnlichkeit: {score:.3f} (0..1)")
    if score >= 0.85:
        label = "sehr ähnlich (Paraphrase-Niveau)"
    elif score >= 0.70:
        label = "klar ähnlich"
    elif score >= 0.50:
        label = "mäßig ähnlich"
    else:
        label = "geringe Ähnlichkeit"
    print("Einschätzung:", label)

if __name__ == "__main__":
    main()


