import { usePrevious } from "@/app/hooks/usePrevious";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaVideo } from "react-icons/fa6";

interface VideoSectionProps {
  handleCloseVideo?: () => void;
  videoUrl?: string;
  videoName?: string;
  id?: string;
  videoWatched?: boolean;
  videoCount?: number;
  currentIndex?: number;
  onSelectIndex?: (index: number) => void;
  onVideoWatched?: () => void;
}

export const VideoSection = ({
  handleCloseVideo,
  videoUrl,
  videoWatched: watched = false,
  videoName = "Einführungsvideo ansehen",
  id = "video-section",
  videoCount,
  currentIndex,
  onSelectIndex,
  onVideoWatched,
}: VideoSectionProps) => {
  const [videoWatched, setVideoWatched] = useState(watched);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevWatched = usePrevious(videoWatched);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (v.duration && v.currentTime / v.duration >= 0.9) {
      setVideoWatched(true);
    }
  }, [videoRef]);

  useEffect(() => {
    if (
      videoWatched &&
      videoWatched !== prevWatched &&
      currentIndex === videoCount - 1
    ) {
      onVideoWatched?.();
    }
  }, [videoWatched, prevWatched]);

  return (
    <div
      id={id}
      className="video-section relative w-[500px] lg:w-full h-full bg-white/50 backdrop-blur-md border border-white/30 rounded-3xl shadow-xl p-6 sm:p-2 flex flex-col gap-6 hover:shadow-2xl transition overflow-hidden"
    >
      {/* Header */}
      <div className="z-[1] absolute w-[100px] top-[-10px] rotate-[-130deg] right-[-35px] h-10 bg-gradient-to-r from-orange-400 to-orange-500 group-hover:from-[#00A6F4]  group-hover:to-[#0087C1] transition-colors duration-300" />

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#00A6F4] to-[#0087C1] text-white text-xl font-extrabold shadow-lg">
          <FaVideo className="text-[#fff]" />
        </div>
        <h2 className="text-2xl sm:text-lg mb-0 font-extrabold text-gray-800">
          {videoName}
        </h2>
      </div>
      {/* Video */}
      <div className="w-full rounded-xl overflow-hidden shadow-lg border border-white/20">
        <video
          onTimeUpdate={handleTimeUpdate}
          ref={videoRef}
          controls
          width="100%"
          src={videoUrl}
        >
          <track
            kind="captions"
            // src="your-captions.vtt"
            srcLang="en"
            label="English"
            default
          />
        </video>
      </div>

      {videoCount! > 1 && (
        <div className="flex gap-2 justify-center mt-2">
          {Array.from({ length: videoCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIndex?.(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {handleCloseVideo && (
        <div className="flex justify-end">
          {!videoWatched ? (
            <button
              onClick={handleCloseVideo}
              className="flex items-center gap-2 rounded-full py-2 sm:py-1 sm:px-2 px-5 shadow-md sm:text-sm cursor-pointer transition bg-gradient-to-r from-[#00A6F4] to-[#0087C1] text-white font-bold hover:scale-105 hover:shadow-xl"
            >
              Video als gesehen markieren
            </button>
          ) : (
            <button className="flex items-center gap-2 rounded-full py-2 sm:py-1 sm:px-2 px-5 shadow-md sm:text-sm cursor-default transition bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold">
              Video gesehen
            </button>
          )}
        </div>
      )}
    </div>
  );
};
