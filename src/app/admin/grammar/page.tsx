"use client";

import GrammarPartsDragDrop from "@/app/components/games/DragGrammarParts/GrammarPartsDragDrop";
import DragAndDropWord from "@/app/components/games/DragWord/DragAndDropWord";
import { QuizGameNew } from "@/app/components/games/QuizGame/QuizGame";
import TimeFormTrainer from "@/app/components/games/TimeFormTrainer/TimeFormTrainer";
import ExampleTheme from "@/app/components/games/WordGame/ExampleTheme";
import MarkTheCaseTrainer from "@/app/components/games/WordGame/MarkTheCaseGame";
import { TypingSpeedPlugin } from "@/app/components/games/WordGame/plugins/TypingSpeedPlugin";
import SemicolonTrainer from "@/app/components/games/WordGame/SemicolonTrainer";
import { UserBar } from "@/app/components/games/WordGame/UserBar";
import { InfoOrTasks } from "@/app/components/games/WordGame/VideoOrTasks";
import { Categories, Topics } from "@/app/enums";
import { Instructions } from "@/app/types";
import { ArrowLeft } from "@/app/ui/assets/icons/ArrowLeft";
import { InfoIcon } from "@/app/ui/assets/icons/InfoIcon";
import { ModalRef, TrainingModal } from "@/app/ui/components/CategoryModal";
import { FilterButton } from "@/app/ui/components/FilterButton";
import { GameOverOverlay } from "@/app/ui/components/GameOverlay";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { motion } from "framer-motion";
import { ParagraphNode, TextNode } from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiQuizlet } from "react-icons/si";

const instructionsSets: Instructions[] = [
  {
    title: "Anweisung 1",
    tasks: [
      "Task 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Task 2: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Task 3: Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
  },
  {
    title: "Anweisung 2",
    tasks: [
      "Task A: Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
      "Task B: Nullam varius, turpis et commodo pharetra, est eros bibendum elit.",
      "Task C: Nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis.",
    ],
  },
  {
    title: "Anweisung 3",
    tasks: [
      "Task I: Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      "Task II: Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
      "Task III: Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.",
    ],
  },
];

const WordGame = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const modalRef = useRef<ModalRef>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 500);
  const [isQuizletStarted, setIsQuizletStarted] = useState<boolean>(false);
  const [isAnalyticsVisible, setIsAnalyticsVisible] = useState<boolean>(false);
  const [isInstructionsVisible, setIsInstructionsVisible] =
    useState<boolean>(true);
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(false);
  const total = useMemo(() => instructionsSets.length, [instructionsSets]);

  const handleOpenAnalytics = useCallback(() => {
    setIsAnalyticsVisible(true);
    setIsInstructionsVisible(false);
    setIsEditorVisible(false);
  }, []);

  const handleOpenInstructions = useCallback(() => {
    setIsAnalyticsVisible(false);
    setIsInstructionsVisible(true);
    setIsEditorVisible(false);
  }, []);

  const handleOpenEditor = useCallback(() => {
    setIsAnalyticsVisible(false);
    setIsInstructionsVisible(false);
    setIsEditorVisible(true);
  }, []);

  useEffect(() => {
    setIsModalVisible(true);
    return () => {
      setIsModalVisible(false);
    };
  }, []);

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 500;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (isMobile) {
      if (isAnalyticsVisible) {
        handleOpenAnalytics();
      } else if (isInstructionsVisible) {
        handleOpenInstructions();
      } else if (isEditorVisible) {
        handleOpenEditor();
      } else {
        handleOpenInstructions();
      }
    }
  }, [isMobile]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
  }, [total]);

  const handleRestart = useCallback(() => {
    setGameOver(false);
    setEditorKey((prev) => prev + 1);
  }, []);

  const handleInfoClick = useCallback(() => {
    setIsInfoOpen((prev) => !prev);
    if (isMobile) {
      handleOpenInstructions();
    }
  }, [isMobile, handleOpenInstructions]);

  const AnalyticsSection = useCallback(
    () => (
      <div className="analytics-section w-full max-w-7xl flex items-center justify-center">
        <TypingSpeedPlugin setGameOver={setGameOver} />
      </div>
    ),
    [setGameOver]
  );

  const editorConfig = {
    namespace: "KrazyEditor",
    nodes: [ParagraphNode, TextNode, ListNode, ListItemNode],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
    html: {},
  };

  const textCategory = useMemo(
    () => selectedCategory?.name === Categories.Textsorten,
    [selectedCategory]
  );

  const wortartenTopic = useMemo(
    () => selectedTopic?.name === Topics.Wortarten,
    [selectedTopic?.name]
  );

  const satzartenTopic = useMemo(
    () => selectedTopic?.name === Topics.Satzarten,
    [selectedTopic?.name]
  );
  const zeitenTopic = useMemo(
    () => selectedTopic?.name === Topics.Zeiten,
    [selectedTopic?.name]
  );
  const faelleTopic = useMemo(
    () => selectedTopic?.name === Topics.Faelle,
    [selectedTopic?.name]
  );

  const beistrichTopic = useMemo(
    () => selectedTopic?.name === Topics.Beistrich,
    [selectedTopic?.name]
  );

  const currentTopicComponent = wortartenTopic ? (
    <DragAndDropWord
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
    />
  ) : satzartenTopic ? (
    <GrammarPartsDragDrop
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
    />
  ) : zeitenTopic ? (
    <TimeFormTrainer
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
    />
  ) : faelleTopic ? (
    <MarkTheCaseTrainer
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
    />
  ) : beistrichTopic ? (
    <SemicolonTrainer
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
    />
  ) : (
    <></>
  );

  const renderTopicSection = (content: React.ReactNode) => {
    if (isQuizletStarted) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-4xl flex gap-4 items-stretch"
        >
          <QuizGameNew
            gameStarted={gameStarted}
            setGameStarted={setGameStarted}
          />
        </motion.div>
      );
    }

    if (gameStarted) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-7xl flex gap-4 items-stretch"
        >
          <div className="flex-1">{content}</div>
        </motion.div>
      );
    }

    return (
      <div
        className={`${textCategory ? "w-full" : "tasks-editor-container"} max-w-7xl gap-4 `}
      >
        {!isMobile && !gameStarted && !textCategory && (
          <InfoOrTasks
            isInfoOpen={isInfoOpen}
            setIsInfoOpen={setIsInfoOpen}
            instructions={instructionsSets[currentIndex]}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      </div>
    );
  };

  const renderDesktopContent = () => (
    <>
      {!textCategory && <AnalyticsSection />}

      {currentTopicComponent && renderTopicSection(currentTopicComponent)}
    </>
  );

  const renderMobileContent = () => (
    <>
      {isAnalyticsVisible && !textCategory && <AnalyticsSection />}
      {isInstructionsVisible && (
        <InfoOrTasks
          isInfoOpen={isInfoOpen}
          setIsInfoOpen={setIsInfoOpen}
          instructions={instructionsSets[currentIndex]}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      )}
      {isEditorVisible &&
        currentTopicComponent &&
        renderTopicSection(currentTopicComponent)}
    </>
  );

  const handleGoBack = () => {
    setIsModalVisible(true);
  };

  if (isModalVisible) {
    return (
      <TrainingModal
        ref={modalRef}
        onClose={() => setIsModalVisible(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSelectTopic={(topic) => {
          setSelectedTopic(topic);
        }}
      />
    );
  }

  return (
    <>
      <div className="mx-4 w-[98%] max-w-7xl">
        <div className="flex items-center justify-between w-full mt-6 px-4 py-3 rounded-3xl bg-white/60 backdrop-blur-sm shadow-md border border-[#d0e7ff] hover:shadow-lg transition-all duration-300 relative z-10">
          <div className="flex items-center gap-4 sm:gap-2">
            <div
              onClick={handleGoBack}
              className="bg-white rounded-full p-2 shadow-md border border-[#d0e7ff] cursor-pointer hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-6 h-6" fill="#00A6F4" />
            </div>
            <p className="text-2xl sm:text-xl font-extrabold text-[#000] drop-shadow-sm">
              Schreibtrainer
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-2">
            <button
              className="flex items-center  gap-2 bg-white rounded-full px-4 py-2 sm:p-1 shadow-md border border-[#d0e7ff] hover:shadow-lg hover:scale-105 transition"
              onClick={() => setIsQuizletStarted(!isQuizletStarted)}
            >
              <SiQuizlet
                className="w-5 h-5 sm:w-3 sm:h-3 text-[#00A6F4]"
                fill="#00A6F4"
              />
              {!isMobile && (
                <p className="text-sm  font-semibold text-[#000]">Quiz</p>
              )}
            </button>

            <button
              onClick={handleInfoClick}
              className="flex items-center  gap-2 bg-white rounded-full px-4 py-2 sm:p-1 shadow-md border border-[#d0e7ff] hover:shadow-lg hover:scale-105 transition"
            >
              <InfoIcon
                className="w-5 h-5 sm:w-3 sm:h-3 text-[#00A6F4]"
                fill="#00A6F4"
              />
              {!isMobile && (
                <p className="text-sm font-semibold text-[#000]">Info</p>
              )}
            </button>
            <UserBar />
          </div>
        </div>
      </div>

      <LexicalComposer key={editorKey} initialConfig={editorConfig}>
        {/* Mobile Filter Buttons */}
        <div className="mobile-tools-filter">
          <FilterButton
            label="Analytics"
            isActive={isAnalyticsVisible}
            onClick={handleOpenAnalytics}
          />
          <FilterButton
            label="Instructions"
            isActive={isInstructionsVisible}
            onClick={handleOpenInstructions}
          />
          <FilterButton
            label="Editor"
            isActive={isEditorVisible}
            onClick={handleOpenEditor}
          />
        </div>

        {/* Desktop or Mobile Content */}
        {isMobile ? renderMobileContent() : renderDesktopContent()}
        {/* Game Over Overlay */}
        {gameOver && <GameOverOverlay onRestart={handleRestart} />}
      </LexicalComposer>
    </>
  );
};

export default WordGame;
