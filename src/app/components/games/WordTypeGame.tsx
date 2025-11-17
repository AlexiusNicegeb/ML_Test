import { Button } from "@/app/ui/components/Button";
import { useEffect, useState } from "react";

interface word {
  word: string;
  type: string;
}

const wordTypes: string[] = [
  "Nomen",
  "Verben",
  "Adejektive",
  "Artikel",
  "Pronomen",
  "Adverbien",
  "Präpositionen",
  "Konjunktionen",
  "Partikeln",
]; //* db-fetch

const wordList: word[] = [
  { word: "Hund", type: "Nomen" },
  { word: "Haus", type: "Nomen" },
  { word: "Schule", type: "Nomen" },
  { word: "lachen", type: "Verben" },
  { word: "tanzen", type: "Verben" },
  { word: "gehen", type: "Verben" },
  { word: "der", type: "Artikel" },
  { word: "die", type: "Artikel" },
  { word: "das", type: "Artikel" },
  { word: "sein", type: "Pronomen" },
  { word: "seine", type: "Pronomen" },
  { word: "ihre", type: "Pronomen" },
  { word: "bald", type: "Adverbien" },
  { word: "dort", type: "Adverbien" },
  { word: "auf", type: "Präpositionen" },
  { word: "bis", type: "Präpositionen" },
  { word: "dass", type: "Konjunktionen" },
  { word: "weil", type: "Konjunktionen" },
  { word: "doch", type: "Partikeln" },
  { word: "oje", type: "Partikeln" },
]; //* db-fetch

export const WordTypeGame = () => {
  const [currentWord, setCurrentWord] = useState<word>(wordList[0]);
  const [correctPos, setCorrectPos] = useState(0);
  const [currentWordtypeList, setcurrentWordtypeList] = useState([
    wordTypes[0],
    wordTypes[1],
    wordTypes[2],
    wordTypes[3],
  ]);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    nextWord();
  }, []);

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  function getRndWord(): word {
    const rnd = getRandomInt(wordList.length);
    return wordList[rnd];
  }
  function getRndWordtypeList(cw: word, cp: number): string[] {
    const wordTypeList: string[] = [];
    for (let i = 0; i <= 3; i++) {
      if (i == cp) {
        wordTypeList.push(cw["type"]);
      } else {
        let done = false;
        let c = 0;
        while (!done) {
          c++;
          const rnd = getRandomInt(wordTypes.length);
          if (
            !wordTypeList.includes(wordTypes[rnd]) &&
            wordTypes[rnd] != cw["type"]
          ) {
            wordTypeList.push(wordTypes[rnd]);
            done = true;
          }
          if (c > 1000) {
            throw new Error("Über 1000 durchgänge in der while schleife!");
          }
        }
      }
    }
    return wordTypeList;
  }

  function nextWord() {
    const cw = getRndWord();
    const cp = getRandomInt(4);
    const rl = getRndWordtypeList(cw, cp);
    setCurrentWord(cw);
    setCorrectPos(cp);
    setcurrentWordtypeList(rl);
  }
  const answer = (id: number) => {
    if (id == correctPos) {
      setPoints(points + 1);
      alert("Richtig!");
      nextWord();
    } else {
      setPoints(0);
      alert("Das ist leider falsch, versuchs weiter!");
    }
  };

  return (
    <div>
      <h1>Wortarten raten</h1>
      <h2>Zu welcher Wortgruppe gehört folgendes Wort? </h2>
      <label htmlFor="Wortanzeige">Das Wort: </label>
      <h1 id="Wortanzeige">{currentWord!["word"]}</h1>
      <table>
        <tbody>
          <tr>
            <td>
              <Button
                className="w-full justify-center"
                onClick={() => answer(0)}
              >
                {currentWordtypeList![0]}
              </Button>
            </td>
            <td>
              <Button
                className="w-full justify-center"
                onClick={() => answer(1)}
              >
                {currentWordtypeList![1]}
              </Button>
            </td>
            <td>
              <Button
                className="w-full justify-center"
                onClick={() => answer(2)}
              >
                {currentWordtypeList![2]}
              </Button>
            </td>
            <td>
              <Button
                className="w-full justify-center"
                onClick={() => answer(3)}
              >
                {currentWordtypeList![3]}
              </Button>
            </td>
          </tr>
          <tr>
            <td>
              <p>Deine Punkte:</p>
            </td>
            <td>
              <p>{points}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
