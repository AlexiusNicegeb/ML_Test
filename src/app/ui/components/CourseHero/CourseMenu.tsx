import Link from "next/link";
import { OverviewIcon } from "../../assets/icons/OverviewIcon";
import { VideoIcon } from "../../assets/icons/VideoIcon";
import { TextIcon } from "../../assets/icons/TextIcon";
import { useCurrentPath } from "@/app/hooks/useCurrentPath";
import clsx from "clsx";

interface CourseMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const CourseMenu = (props: CourseMenuProps) => {
  const { activeSection, setActiveSection } = props;
  const currentPath = useCurrentPath();

  return (
    <div className="flex gap-4 flex-wrap">
      {/* Overview */}
      <Link
        href={`${currentPath}`}
        onClick={() => setActiveSection("overview")}
        className={clsx(
          "flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold shadow transition-all duration-300 border",
          activeSection === "overview"
            ? "bg-gradient-to-r from-[#00A6F4] to-[#0087C1] text-white border-[#00A6F4] shadow-lg hover:scale-105"
            : "bg-white/40 text-[#00A6F4] border-[#d0e7ff] hover:bg-white/60 hover:shadow-md hover:scale-105"
        )}
      >
        <OverviewIcon
          color={activeSection === "overview" ? "white" : "#00A6F4"}
        />
        Overview
      </Link>

      {/* Videos */}
      <Link
        href={`${currentPath}`}
        onClick={() => setActiveSection("videos")}
        className={clsx(
          "flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold shadow transition-all duration-300 border",
          activeSection === "videos"
            ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-500 shadow-lg hover:scale-105"
            : "bg-white/40 text-orange-500 border-[#d0e7ff] hover:bg-white/60 hover:shadow-md hover:scale-105"
        )}
      >
        <VideoIcon
          height="20px"
          width="20px"
          color={activeSection === "videos" ? "white" : "orange"}
        />
        Videos
      </Link>

      {/* Unterlagen */}
      <Link
        href={`${currentPath}`}
        onClick={() => setActiveSection("unterlagen")}
        className={clsx(
          "flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold shadow transition-all duration-300 border",
          activeSection === "unterlagen"
            ? "bg-gradient-to-r from-green-400 to-green-500 text-white border-green-500 shadow-lg hover:scale-105"
            : "bg-white/40 text-green-500 border-[#d0e7ff] hover:bg-white/60 hover:shadow-md hover:scale-105"
        )}
      >
        <TextIcon
          height="20px"
          width="20px"
          color={activeSection === "unterlagen" ? "white" : "green"}
        />
        Unterlagen
      </Link>
    </div>
  );
};
