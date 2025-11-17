export const DUMMY_TEXT =
  "Dies ist ein Beispieltxt zum testen.\nDer  Klimawandel ist die größte Herausforderung.\n\nSehr geehrter Redaktion!\nSich die meisten Experten . Die Gesellschaft wird dadurch auch , da einzelne Maßnahmen zur  stärker angeprangert werden als . Ein falsches Wort: Klimawandel. Das ist ein großer . Die  , die durch den Anstieg von Treibhausgasen wie  verursacht wird, hat weitreichende . Es ist wichtig, dass wir jetzt handeln.";
export const DUMMY_RESULT = {
  totalScore: 82,
  categories: [
    {
      name: "Sprachrichtigkeit",
      score: 90,
      errors: [
        {
          name: "Rechtschreibung",
          items: [
            {
              type: "Rechtschreibfehler",
              error: "Beispieltxt",
              suggestion: "Beispieltext",
              position: 13,
            },
          ],
        },
        {
          name: "Grammatik",
          items: [
            {
              type: "Grammatikfehler (Fall)",
              error: "geehrter",
              suggestion: "geehrte",
              position: 92,
            },
          ],
        },
      ],
    },
    {
      name: "Ausdruck",
      score: 75,
    },
    {
      name: "Textstruktur",
      score: 80,
    },
    {
      name: "Inhalt",
      score: 85,
    },
  ],
};
