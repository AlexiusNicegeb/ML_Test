"use client";

import { useUserAuth } from "@/app/context/user/UserAuthContext";
import { COURSE_TYPES } from "@/app/models/course-types";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface Topic {
  name: string;
  icon: JSX.Element;
}

interface Category {
  name: string;
  color: string;
  gradient: string;
  icon: JSX.Element;
  topics: Topic[];
}

const categories: Category[] = [
  {
    name: "Grammatik",
    color: "bg-blue-500",
    gradient: "from-blue-400 to-blue-600",
    icon: <span className="text-5xl sm:text-3xl">📚</span>,
    topics: [
      { name: "Wortarten", icon: <span>🔤</span> },
      { name: "Satzarten & Satzglieder", icon: <span>📝</span> },
      { name: "Kongruenz", icon: <span>⚖️</span> },
      { name: "Zeiten richtig anwenden", icon: <span>⏰</span> },
      { name: "Fälle & Präpositionen", icon: <span>📍</span> },
    ],
  },
  {
    name: "Rechtschreibung",
    color: "bg-yellow-400",
    gradient: "from-yellow-300 to-yellow-500",
    icon: <span className="text-5xl sm:text-3xl">✍️</span>,
    topics: [
      { name: "Beistrichsetzung", icon: <span>🖋️</span> },
      { name: "Groß- und Kleinschreibung", icon: <span>🔠</span> },
      { name: "Getrennt- und Zusammenschreibung", icon: <span>🔗</span> },
      { name: "häufige Fehler", icon: <span>❗</span> },
      { name: "S-Schreibung", icon: <span>➰</span> },
    ],
  },
  {
    name: "Textsorten",
    color: "bg-purple-500",
    gradient: "from-purple-400 to-purple-600",
    icon: <span className="text-5xl sm:text-3xl">📝</span>,
    topics: [
      { name: COURSE_TYPES.KOMMENTAR, icon: <span>💬</span> },
      { name: COURSE_TYPES.LESERBRIEF, icon: <span>✉️</span> },
      { name: COURSE_TYPES.EROERTERUNG, icon: <span>🤔</span> },
      { name: COURSE_TYPES.MEINUNGSREDE, icon: <span>🎤</span> },
      { name: COURSE_TYPES.TEXTANALYSE, icon: <span>🔍</span> },
      { name: COURSE_TYPES.TEXTINTERPRETATION, icon: <span>🧠</span> },
      { name: "Zusammenfassung", icon: <span>📄</span> },
    ],
  },
];

export interface ModalRef {
  closeModal: () => void;
}

interface ModalProps {
  onClose?: () => void;
  onSelectTopic?: (topic: Topic) => void;
  selectedCategory?: Category;
  setSelectedCategory: (category: Category | null) => void;
}

export const TrainingModal = forwardRef<ModalRef, ModalProps>(
  ({ onClose, onSelectTopic, selectedCategory, setSelectedCategory }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [fadeInClass, setFadeInClass] = useState("");
    const [activePage, setActivePage] = useState<"textsorten" | "grammar">(
      "textsorten"
    );
    const { user } = useUserAuth();
    const isAdmin = user && typeof user !== "boolean" && user?.role === "ADMIN";
    const router = useRouter();
    const currentPath = usePathname();
    const isMobile = window.innerWidth < 500;
    const closeModal = () => {
      setFadeInClass("");
      setTimeout(() => {
        onClose?.();
      }, 600);
    };

    const handleClickCloseModal = () => {
      onClose();
      router.back();
      // closeModal();
    };
    useImperativeHandle(ref, () => ({ closeModal }));

    useEffect(() => {
      setTimeout(() => setFadeInClass("animate-in"), 50);
      const handleKeyboard = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
      };
      document.addEventListener("keydown", handleKeyboard);
      return () => document.removeEventListener("keydown", handleKeyboard);
    }, []);

    useEffect(() => {
      setActivePage(
        currentPath.includes("/grammar") ? "grammar" : "textsorten"
      );
    }, []);
    const shownCategories = categories.filter((cat) => {
      if (activePage === "textsorten") return cat.name === "Textsorten";
      if (activePage === "grammar") return isAdmin && cat.name !== "Textsorten";
      return false;
    });

    return createPortal(
      <div className={clsx("modal-wrapper", fadeInClass)} ref={modalRef}>
        <div
          className={`w-[98%]  h-[90%] sm:h-auto rounded-xl mt-16 flex flex-col items-center justify-start transition-colors duration-500 ${
            selectedCategory ? selectedCategory.color : "bg-lightGrey "
          } p-8 sm:p-3`}
        >
          <div className="min-h-screen sm:min-h-full w-full flex flex-col items-center justify-start transition-colors duration-500 p-8 sm:p-2">
            <IoIosCloseCircleOutline
              className="absolute right-20 top-[120px] sm:right-6 z-50  sm:top-[85px] cursor-pointer"
              size={isMobile ? 30 : 40}
              color={selectedCategory ? "#fff" : "#000"}
              onClick={handleClickCloseModal}
            />

            {selectedCategory ? (
              <>
                <div
                  className={`relative flex w-full max-w-6xl items-center justify-center mb-6 `}
                >
                  <ArrowLeftCircleIcon
                    onClick={() => setSelectedCategory(null)}
                    className="absolute left-0 top-0 w-10 h-10 sm:w-8 sm:h-8 text-white hover:scale-110 transition cursor-pointer"
                  />
                  <h1 className="text-3xl  font-bold text-white">
                    {selectedCategory.name}
                  </h1>
                </div>
                <div className="flex flex-wrap justify-center gap-8 sm:gap-5 w-full max-w-6xl mx-auto animate-fade-in p-10 sm:p-3">
                  {selectedCategory.topics.map((topic) => (
                    <div
                      key={topic.name}
                      onClick={() => {
                        onSelectTopic?.(topic);
                        closeModal();
                      }}
                      className="cursor-pointer bg-white min-w-[200px] sm:min-w-[120px] max-w-[240px] p-6 sm:p-2 rounded-lg shadow-md hover:shadow-xl transition-transform hover:scale-105 text-darkGrey text-center font-bold text-lg flex flex-col items-center justify-center gap-4 sm:gap-2"
                    >
                      <div className="text-4xl sm:text-xl">{topic.icon}</div>
                      <div className="sm:text-sm">{topic.name}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="relative flex w-full max-w-6xl items-center justify-center mb-6">
                  <h1 className="text-3xl sm:text-xl font-bold text-darkBlue">
                    {activePage === "textsorten"
                      ? "Textsorten"
                      : "Grammatik / Rechtschreibung"}
                  </h1>
                </div>
                <div className="flex sm:flex-col justify-center gap-8 w-full max-w-6xl mx-auto animate-fade-in p-10">
                  {shownCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex ${cat.name === "Textsorten" && "w-[550px]"} flex-col sm:h-[100px] items-center w-full justify-center p-12 sm:p-10 rounded-xl shadow-lg bg-gradient-to-br ${cat.gradient} text-white hover:scale-105 transition-transform`}
                    >
                      {cat.icon}
                      <h2 className="mt-6 text-2xl sm:text-xl sm:mt-1 font-semibold">
                        {cat.name}
                      </h2>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);
