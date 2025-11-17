"use client";

import React from "react";
import { FaUserEdit } from "react-icons/fa";
import { FaBolt, FaFilePdf, FaPlay, FaForward } from "react-icons/fa6";
import { ButtonConfig, ControlButton } from "./ControlButton";

type TopControlPanelProps = {
  roundIndex: number | null;
  taskVideos: string[][];
  startVideo: boolean;
  setStartVideo: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentVideoIndex: React.Dispatch<React.SetStateAction<number>>;
  setVideoIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setShowPDF: (val: boolean) => void;
  setErrors: (val: boolean) => void;
  startRound: (round: number) => void;
};

const gradientThemes = {
  red: ["#FEE2E2", "#FECACA"],
  green: ["#D1FAE5", "#A7F3D0"],
  yellow: ["#ECFCCB", "#D9F99D"],
  blue: ["#E0E7FF", "#C7D2FE"],
  pink: ["#FCE7F3", "#FBCFE8"],
  peach: ["#FFE7D1", "#FCD9B6"],
};

export const TopControlPanel: React.FC<TopControlPanelProps> = ({
  roundIndex,
  taskVideos,
  setCurrentVideoIndex,
  setVideoIndex,
  setErrors,
  startVideo,
  setStartVideo,
  setShowPDF,
  startRound,
}) => {
  const handleStartVideo = () => {
    setShowPDF(false);
    setErrors(false);

    if (roundIndex === null) {
      setStartVideo(true);
      setVideoIndex(0);
      return;
    }

    const videos = taskVideos[roundIndex];
    if (videos && videos.length > 0) {
      if (!startVideo) {
        setCurrentVideoIndex(0);
      } else {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      }
      setStartVideo(true);
    }
  };

  const buttons: ButtonConfig[] = [
    {
      label: !startVideo ? "Start Video" : "Next Video",
      icon: !startVideo ? <FaPlay /> : <FaForward />,
      gradientFrom: gradientThemes.peach[0],
      gradientTo: gradientThemes.peach[1],
      onClick: handleStartVideo,
    },
    {
      label: "Show PDF",
      icon: <FaFilePdf />,
      gradientFrom: gradientThemes.red[0],
      gradientTo: gradientThemes.red[1],
      onClick: () => {
        setShowPDF(true);
        setStartVideo(false);
      },
    },
    {
      label: "Text Editor",
      icon: <FaUserEdit />,
      gradientFrom: gradientThemes.blue[0],
      gradientTo: gradientThemes.blue[1],
      onClick: () => {
        startRound(0);
        setVideoIndex(0);
        setStartVideo(false);
      },
    },
    ...[2, 3, 4, 5].map((round, idx) => ({
      label: `Round ${round}`,
      icon: <FaBolt />,
      gradientFrom:
        Object.values(gradientThemes)[
          (idx + 1) % Object.keys(gradientThemes).length
        ][0],
      gradientTo:
        Object.values(gradientThemes)[
          (idx + 1) % Object.keys(gradientThemes).length
        ][1],
      onClick: () => {
        startRound(round - 1);
        setStartVideo(false);
      },
    })),
  ];

  return (
    <div className="flex gap-4 w-full z-10 sm:flex-wrap md:justify-center">
      {buttons.map((btn, idx) => (
        <ControlButton key={idx} {...btn} />
      ))}
    </div>
  );
};
