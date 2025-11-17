"use client";

import { UserBar } from "@/app/components/games/WordGame/UserBar";
import { InfoOrTasks } from "@/app/components/games/WordGame/VideoOrTasks";
import { useWordGameState } from "@/app/hooks/useGameState";
import GameStartModal from "@/app/ui/components/WordGame/GameStartModal";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import { ArrowLeft } from "../../assets/icons/ArrowLeft";
import { InfoIcon } from "../../assets/icons/InfoIcon";
import { ModalRef, TrainingModal } from "../CategoryModal";
import { TopControlPanel } from "../EditorGame/TopControlPanel";
import { GameComponent } from "../WordGame/GameComponent";
import { VideoSection } from "../WordGame/VideoSection";

const WordGame = () => {
  const {
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
  } = useWordGameState();

  const modalRef = useRef<ModalRef>(null);

  useEffect(() => {
    setIsModalVisible(true);
    return () => {
      setIsModalVisible(false);
    };
  }, []);

  const videoClose = roundIndex !== 0;

  const currentVideoUrl =
    roundIndex !== null && taskVideos[roundIndex]?.[currentVideoIndex]
      ? taskVideos[roundIndex][currentVideoIndex]
      : null;

  const renderTopicSection = (content: React.ReactNode) => {
    const showInfo =
      !gameStarted && videoClose && !startVideo && roundIndex !== 0;

    const containerClass = clsx(
      "flex justify-center gap-4 max-w-7xl",
      roundIndex === 0 || gameStarted
        ? "w-full"
        : "w-full tasks-editor-container",
      startVideo && "tasks-editor-container"
    );

    return (
      <div className={containerClass}>
        {showInfo && !isMobile && (
          <InfoOrTasks
            isInfoOpen={isInfoOpen}
            setIsInfoOpen={setIsInfoOpen}
            instructions={instructionsSets[currentIndex]}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        )}

        {currentVideoUrl && startVideo && !showErrors && (
          <VideoSection
            handleCloseVideo={() => setStartVideo(false)}
            videoUrl={currentVideoUrl}
            videoName={`Video ${currentVideoIndex + 1}`}
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
    <div className="w-full max-w-7xl flex gap-8 flex-col">
      <TopControlPanel
        startVideo={startVideo}
        setStartVideo={setStartVideo}
        roundIndex={roundIndex}
        setCurrentVideoIndex={setCurrentVideoIndex}
        taskVideos={taskVideos}
        setVideoIndex={setRoundIndex}
        setShowPDF={setShowPDF}
        setErrors={setShowErrors}
        startRound={startRound}
      />
      {renderTopicSection(
        <GameComponent
          textCategory={textCategory}
          roundIndex={roundIndex}
          rounds={[
            { round: 0, game: "EditorGame" },
            { round: 1, game: "TimeFormTrainer" },
            { round: 2, game: "QuizGameNew" },
            { round: 3, game: "DragAndDropWord" },
            { round: 4, game: "GrammarPartsDragDrop" },
          ]}
          showPDF={showPDF}
          setShowPDF={setShowPDF}
          taskVideos={taskVideos}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          setVideoIndex={setRoundIndex}
        />
      )}

      {gameStarted && (
        <GameStartModal
          round={roundIndex}
          onStart={() => {
            setGameStarted(true);
          }}
        />
      )}
    </div>
  );

  const handleGoBack = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  if (isModalVisible) {
    return (
      <TrainingModal
        ref={modalRef}
        onClose={() => setIsModalVisible(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
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

      <LexicalComposer initialConfig={editorConfig}>
        {renderDesktopContent()}
      </LexicalComposer>
    </>
  );
};

export default WordGame;
