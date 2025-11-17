"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
  rectIntersection,
  MouseSensor,
} from "@dnd-kit/core";
import { DragOverlay } from "@dnd-kit/core";
import VictoryModal from "@/app/ui/components/WordGame/VictoryModal";
import GameStatsBar from "@/app/ui/components/WordGame/GameStatsBar";
import { WordType } from "@/app/types";
import { PART_OF_SPEECH, PART_VIDEO_FOR_SPEECH } from "@/app/staticData";
import { PartOfSpeech } from "./PartOfSpeech";
import { Word } from "./WordBlock";
import { PartVideoPlayer } from "../PartVideoPlayer";

export default function DragAndDropWord({
  gameStarted,
  setGameStarted,
}: {
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [allCorrect, setAllCorrect] = useState<boolean>(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  const [words, setWords] = useState<WordType[]>([
    { word: "Mein", correctType: "", expected: "Pronomen", highlight: "none" },
    { word: "Vater", correctType: "", expected: "Noun", highlight: "none" },
    { word: "geht", correctType: "", expected: "Verb", highlight: "none" },
    { word: "gerne", correctType: "", expected: "Adverb", highlight: "none" },
    {
      word: "ins",
      correctType: "",
      expected: "Preposition",
      highlight: "none",
    },
    { word: "Kino", correctType: "", expected: "Noun", highlight: "none" },
  ]);

  useEffect(() => {
    const allRight = words.every(
      (w) => w.correctType !== "" && w.correctType === w.expected
    );
    setAllCorrect(allRight);
  }, [words]);
  const completedWords = words.filter(
    (w) => w.correctType !== "" && w.correctType === w.expected
  );

  const targets = words;

  const sensors = useSensors(
    useSensor(MouseSensor, {
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

  const handleDragStart = useCallback((event: any) => {
    setActiveId(event.active.id);
    document.body.style.overflow = "hidden";
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    document.body.style.overflow = "";
    setActiveId(null);

    if (!active || !over) return;

    const draggedType = active.data.current?.partOfSpeech;
    if (!draggedType) return;

    const overId = over.id;

    const matchFound = words.some(
      (item) => item.word === overId && item.expected === draggedType
    );

    if (matchFound) {
      setStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    setWords((prev) =>
      prev.map((item) => {
        if (item.word !== overId) return item;
        if (item.expected === draggedType) {
          return {
            ...item,
            correctType: draggedType,
            highlight: "correct",
          };
        } else {
          return {
            ...item,
            highlight: "incorrect",
          };
        }
      })
    );

    setTimeout(() => {
      setWords((prev) => prev.map((w) => ({ ...w, highlight: "none" })));
    }, 1500);
  }, []);

  useEffect(() => {
    if (allCorrect) {
      setShowVictoryModal(true);
    }
  }, [allCorrect]);

  return (
    <div
      className={`relative w-full h-full ${!gameStarted && "max-h-[450px] overflow-hidden"}`}
    >
      {!gameStarted && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 rounded-3xl">
          <h2 className="text-[#000] text-4xl font-extrabold mb-8 text-center px-6 drop-shadow-sm">
            Bist du bereit? Starte dein Grammatik-Abenteuer! 🚀
          </h2>
          <button
            onClick={() => setGameStarted(true)}
            className="bg-gradient-to-r from-[#6EE7B7] to-[#34D399] hover:brightness-105 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transition-transform hover:scale-105"
          >
            Start
          </button>
        </div>
      )}
      <div className="flex items-center gap-4 md:flex-col ">
        <PartVideoPlayer
          selectedPart={selectedPart}
          onClose={() => setSelectedPart(null)}
          videoMap={PART_VIDEO_FOR_SPEECH}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        >
          <div className="flex-[2] bg-gradient-to-b from-[#bfdbfe] to-[#93c5fd] rounded-3xl shadow-2xl overflow-hidden relative min-h-[400px]">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 w-[160%] h-[160%] bg-gradient-radial from-white/10 to-transparent rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"></div>

            <div className="flex flex-col bg-white/60 backdrop-blur-md border-b border-white/30 rounded-t-3xl p-5 shadow-md relative z-10 ">
              <div className="flex sm:mb-1 justify-between items-center w-full">
                <h2 className="text-2xl sm:text-lg font-extrabold text-[#005B8F] drop-shadow-sm mb-0">
                  Teste deinen Grammatikinstinkt!
                </h2>
                <button
                  className="bg-gradient-to-r sm:text-sm from-[#FCA5A5] to-[#F87171] hover:brightness-105 active:brightness-95 text-white font-bold py-2 px-5 sm:py-1 sm:px-2 rounded-full shadow transition-transform hover:scale-105"
                  onClick={() => setGameStarted(false)}
                >
                  End game
                </button>
              </div>
              <div className="text-[#1e3a8a] text-sm font-medium flex items-center gap-2">
                <span>
                  Ziehe die Wortart und lasse sie auf das richtige Wort fallen
                  💡
                </span>
              </div>
            </div>

            {gameStarted && (
              <GameStatsBar
                xp={completedWords.length * 10}
                streak={streak}
                bestStreak={bestStreak}
                completed={completedWords.length}
                total={targets.length}
              />
            )}

            {allCorrect && gameStarted && (
              <div className="bg-[#D1FAE5] text-[#065F46] font-semibold rounded-2xl sm:text-sm sm:font-normal px-6 py-4 sm:px-3 sm:py-2 text-center shadow-lg my-4 mx-9 drop-shadow">
                Glückwunsch! Du hast alle richtig zugeordnet!
              </div>
            )}

            <div className="px-6 mt-8 sm:mt-2 py-4 sm:py-2 sm:px-3 flex flex-wrap justify-center gap-6">
              {words.map((w) => (
                <Word key={w.word} {...w} />
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-10 overflow-x-auto px-4 mt-4 sm:gap-3 sm:px-2">
              {PART_OF_SPEECH.map((type) => (
                <PartOfSpeech
                  onClick={() => setSelectedPart(type)}
                  key={type}
                  type={type}
                  isDragging={activeId === type}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeId ? <PartOfSpeech type={activeId} /> : null}
          </DragOverlay>
        </DndContext>
        <VictoryModal
          show={showVictoryModal}
          onClose={() => {
            setShowVictoryModal(false);
          }}
          title="🏆  Perfekt abgeschlossen!"
          description="Das war stark – jetzt zum nächsten Level!"
          imageSrc="/robot3.png"
        />
      </div>
    </div>
  );
}
