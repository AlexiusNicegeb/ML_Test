import { FC } from "react";
import { EditorGame } from "../EditorGame/EditorGame";
import TimeFormTrainer from "@/app/components/games/TimeFormTrainer/TimeFormTrainer";
import { QuizGameNew } from "../../../components/games/QuizGame/QuizGame";
import DragAndDropWord from "@/app/components/games/DragWord/DragAndDropWord";
import GrammarPartsDragDrop from "@/app/components/games/DragGrammarParts/GrammarPartsDragDrop";

const gameComponentMap: Record<string, React.FC<any>> = {
  EditorGame: EditorGame,
  TimeFormTrainer: TimeFormTrainer,
  QuizGameNew: QuizGameNew,
  DragAndDropWord: DragAndDropWord,
  GrammarPartsDragDrop: GrammarPartsDragDrop,
};

interface TopicComponentProps {
  textCategory: boolean;
  roundIndex: number;
  rounds: any[];
  showPDF: boolean;
  setShowPDF: (val: boolean) => void;
  taskVideos: string[][];
  gameStarted: boolean;
  setGameStarted: (val: boolean) => void;
  setVideoIndex: (val: number) => void;
}

export const GameComponent: FC<TopicComponentProps> = ({
  textCategory,
  roundIndex,
  rounds,
  showPDF,
  setShowPDF,
  taskVideos,
  gameStarted,
  setGameStarted,
  setVideoIndex,
}) => {
  if (!textCategory || roundIndex === null) {
    return <EditorGame showPDF={showPDF} setShowPDF={setShowPDF} />;
  }

  const componentKey = rounds.find((r) => r.round === roundIndex)?.game;
  const Component = componentKey ? gameComponentMap[componentKey] : null;
  if (!Component) return null;

  return (
    <Component
      videoIndex={roundIndex}
      showPDF={showPDF}
      setVideoIndex={setVideoIndex}
      setShowPDF={setShowPDF}
      taskVideos={taskVideos}
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
    />
  );
};
