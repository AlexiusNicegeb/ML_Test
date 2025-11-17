"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  rectIntersection,
} from "@dnd-kit/core";
import { DragOverlay } from "@dnd-kit/core";
import { motion } from "framer-motion";
import VictoryModal from "@/app/ui/components/WordGame/VictoryModal";
import GameStatsBar from "@/app/ui/components/WordGame/GameStatsBar";
import { FULL_SENTENCE_GROUPS } from "@/app/staticData";
import { SentenceType } from "./SenseType";
import { SentenceBlock } from "./SentenseBlock";
import { PartVideoPlayer } from "../PartVideoPlayer";

export default function GrammarPartsDragDrop({
  gameStarted,
  setGameStarted,
}: {
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
}) {
  const dropHandledRef = useRef<boolean>(false);

  const [step, setStep] = useState<number>(0);
  const [fullSentenceGroupsState, setFullSentenceGroupsState] = useState(
    structuredClone(FULL_SENTENCE_GROUPS)
  );
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  const [allCorrect, setAllCorrect] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const partVideos: Record<string, string> = {
    Subjekt: "https://www.youtube.com/embed/VIDEO_ID_SUBJEKT",
    Prädikat: "https://www.youtube.com/embed/VIDEO_ID_PRADIKAT",
    "Objekt im Genitiv": "https://www.youtube.com/embed/VIDEO_ID_GENITIV",
    "Objekt im Dativ": "https://www.youtube.com/embed/VIDEO_ID_DATIV",
    "Objekt im Akkusativ": "https://www.youtube.com/embed/VIDEO_ID_AKKUSATIV",
    Adverbiale: "https://www.youtube.com/embed/VIDEO_ID_ADVERBIALE",
  };
  const sentenceParts = fullSentenceGroupsState[step];

  const allGroups = fullSentenceGroupsState.flat();

  const totalParts = allGroups.reduce((acc, s) => acc + s.parts.length, 0);
  const completedParts = allGroups.reduce(
    (acc, s) =>
      acc + s.parts.filter((p) => p.currentType === p.correctType).length,
    0
  );

  useEffect(() => {
    const allRight = sentenceParts.every((sentenceObj) =>
      sentenceObj.parts.every(
        (part) =>
          part.currentType !== "" && part.currentType === part.correctType
      )
    );
    setAllCorrect(allRight);
  }, [sentenceParts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const partsOfSentence = [
    "Subjekt",
    "Prädikat",
    "Objekt im Genitiv",
    "Objekt im Dativ",
    "Objekt im Akkusativ",
    "Adverbiale",
  ];

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    document.body.style.overflow = "hidden";
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    document.body.style.overflow = "";

    if (!active || !over) return;

    const draggedType = active.data.current?.partType;
    if (!draggedType) return;

    if (dropHandledRef.current) {
      return;
    }

    let dropProcessed = false;

    setFullSentenceGroupsState((prev) =>
      prev.map((group, groupIndex) => {
        if (groupIndex !== step) return group;
        return group.map((sentenceObj) => ({
          ...sentenceObj,
          parts: sentenceObj.parts.map((item) => {
            if (item.id !== over.id) return item;

            if (item.currentType === draggedType) {
              return item;
            }

            if (item.correctType === draggedType) {
              if (!dropProcessed) {
                dropHandledRef.current = true;
                dropProcessed = true;

                setStreak((prev) => {
                  const newStreak = prev + 1;
                  if (newStreak > bestStreak) {
                    setBestStreak(newStreak);
                  }
                  return newStreak;
                });
              }

              return {
                ...item,
                currentType: draggedType,
                highlight: "correct",
              };
            } else {
              dropHandledRef.current = true;
              dropProcessed = true;

              setStreak(0);
              return {
                ...item,
                highlight: "incorrect",
              };
            }
          }),
        }));
      })
    );

    setTimeout(() => {
      dropHandledRef.current = false;
      setFullSentenceGroupsState((prev) =>
        prev.map((group, groupIndex) => {
          if (groupIndex !== step) return group;
          return group.map((sentenceObj) => ({
            ...sentenceObj,
            parts: sentenceObj.parts.map((p) => ({
              ...p,
              highlight: "none",
            })),
          }));
        })
      );
    }, 1500);

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const nextStep = () => {
    const next = step + 1;
    if (next < FULL_SENTENCE_GROUPS.length) {
      setStep(next);
      setAllCorrect(false);
    }
  };

  useEffect(() => {
    if (allCorrect && step === FULL_SENTENCE_GROUPS.length - 1) {
      setShowVictoryModal(true);
    }
  }, [allCorrect]);

  return (
    <div
      className={`relative w-full h-full ${!gameStarted && "max-h-[450px] overflow-hidden"}`}
    >
      {!gameStarted && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl ">
          <h2 className="text-[#000] text-4xl font-extrabold mb-8 text-center px-6 drop-shadow-sm">
            Satzglieder-Training starten? 🚀
          </h2>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-[#6EE7B7] to-[#34D399] hover:brightness-105 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-transform hover:scale-105"
          >
            Start
          </button>
        </div>
      )}
      <div className="flex flex-col-reverse items-center gap-3">
        <PartVideoPlayer
          selectedPart={selectedPart}
          onClose={() => setSelectedPart(null)}
          videoMap={partVideos}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
          <div
            className={`bg-gradient-to-b from-[#bfdbfe] to-[#93c5fd] rounded-3xl shadow-2xl  max-w-7xl   overflow-hidden relative ${gameStarted ? "" : "max-w-[500px] sm:max-w-[320px] max-h-[450px]"}  border border-white/30 backdrop-blur-md`}
          >
            <div className="flex sm:flex-col justify-between items-center bg-white/60 backdrop-blur-md border-b border-white/30 rounded-t-3xl p-5 shadow-md relative z-10">
              <h2 className="text-2xl sm:text-xl font-extrabold text-[#005B8F] drop-shadow-sm">
                Satzglieder zuordnen!
              </h2>
              <div className="flex items-center gap-3 ">
                <div className="text-center text-[#1e40af] text-lg drop-shadow-sm">
                  Schritt {step + 1} von {FULL_SENTENCE_GROUPS.length}
                </div>
                <button
                  className="bg-gradient-to-r from-[#FCA5A5] to-[#F87171] hover:brightness-105 active:brightness-95 text-white font-bold py-2 px-5 sm:py-1 sm:px-3 rounded-full shadow transition-transform hover:scale-105"
                  onClick={() => setGameStarted(false)}
                >
                  Neu starten
                </button>
              </div>
            </div>

            <GameStatsBar
              xp={completedParts * 10}
              streak={streak}
              bestStreak={bestStreak}
              completed={completedParts}
              total={totalParts}
            />

            {allCorrect && step < FULL_SENTENCE_GROUPS.length - 1 && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[#6EE7B7] to-[#34D399] hover:brightness-105 text-white font-bold py-3 px-8 sm:py-2 sm:px-4 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  Nächste Sätze ➔
                </button>
              </div>
            )}

            {allCorrect && step === FULL_SENTENCE_GROUPS.length - 1 && (
              <div className="bg-[#D1FAE5] text-[#065F46] font-semibold rounded-2xl px-6 py-4 text-center shadow-lg mb-6 mx-9 drop-shadow">
                🎉 Glückwunsch! Du hast alle Sätze korrekt zugeordnet!
              </div>
            )}

            <div className="px-6 py-4 flex flex-col gap-8 sm:px-3 sm:py-2">
              {sentenceParts.map((sentenceObj, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-[#93c5fd]"
                >
                  <div className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-4 py-3 sm:px-2 sm:py-1 text-white font-semibold text-center text-lg sm:text-base drop-shadow-sm">
                    {sentenceObj.sentence}
                  </div>
                  <div className="p-6 sm:p-2 flex  justify-center gap-4">
                    {sentenceObj.parts.map((part) => (
                      <SentenceBlock key={part.id} {...part} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10 overflow-x-auto px-4 mt-4">
              {partsOfSentence.map((type) => (
                <SentenceType
                  onClick={() => setSelectedPart(type)}
                  key={type}
                  type={type}
                  isDragging={activeId === type}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeId ? <SentenceType type={activeId} /> : null}
          </DragOverlay>
        </DndContext>

        <VictoryModal
          show={showVictoryModal}
          onClose={() => {
            setShowVictoryModal(false);
          }}
          title="🎉 Super gemacht!"
          description="Das war stark – jetzt zum nächsten Level!"
          imageSrc="/robot3.png"
        />
      </div>
    </div>
  );
}
