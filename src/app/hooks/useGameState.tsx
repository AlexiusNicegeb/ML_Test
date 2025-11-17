import { ListItemNode, ListNode } from "@lexical/list";
import { ParagraphNode, TextNode } from "lexical";
import { useCallback, useEffect, useMemo, useState } from "react";
import ExampleTheme from "../components/games/WordGame/ExampleTheme";
import { useVale } from "../context/vale/ValeContext";
import { Categories } from "../enums";
import { instructionsSets } from "../staticData";

export interface EditorConfig {
  namespace: string;
  nodes: any[];
  onError: (error: Error) => void;
  theme: any;
  html: object;
}

export const useWordGameState = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 600);
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [showPDF, setShowPDF] = useState<boolean>(false);
  const [startVideo, setStartVideo] = useState<boolean>(false);

  const { setShowErrors, showErrors } = useVale();

  const total = instructionsSets.length;

  const textCategory = useMemo<boolean>(
    () => selectedCategory?.name === Categories.Textsorten,
    [selectedCategory]
  );

  const taskVideos: string[][] = useMemo(
    () => [
      [
        "https://www.youtube.com/embed/VIDEO_ID_1",
        "https://www.youtube.com/embed/VIDEO_ID_2",
      ],
      ["https://www.youtube.com/embed/VIDEO_ID_3"],
      [
        "https://www.youtube.com/embed/VIDEO_ID_4",
        "https://www.youtube.com/embed/VIDEO_ID_5",
      ],
      ["https://www.youtube.com/embed/VIDEO_ID_6"],
    ],
    []
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startRound = useCallback((round: number) => {
    setRoundIndex(round);
    setGameStarted(false);
    setShowPDF(false);
    setShowErrors(false);
    setCurrentVideoIndex(0);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
  }, [total]);

  const handleInfoClick = useCallback(() => {
    setIsInfoOpen((prev) => !prev);
  }, []);

  const editorConfig: EditorConfig = {
    namespace: "KrazyEditor",
    nodes: [ParagraphNode, TextNode, ListNode, ListItemNode],
    onError: (error: Error) => {
      throw error;
    },
    theme: ExampleTheme,
    html: {},
  };

  return {
    isModalVisible,
    setIsModalVisible,
    isInfoOpen,
    setIsInfoOpen,
    selectedCategory,
    setSelectedCategory,
    gameStarted,
    setGameStarted,
    currentIndex,
    currentVideoIndex,
    setCurrentVideoIndex,
    isMobile,
    roundIndex,
    setRoundIndex,
    showPDF,
    setShowPDF,
    startVideo,
    setStartVideo,
    showErrors,
    setShowErrors,
    startRound,
    handleNext,
    handlePrev,
    handleInfoClick,
    editorConfig,
    textCategory,
    instructionsSets,
    taskVideos,
  };
};
