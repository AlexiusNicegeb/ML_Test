import { useVale } from "@/app/context/vale/ValeContext";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { STATIC_TEXT, TASK_LABELS } from "@/app/staticData";
import { EditorContent, TaskKey } from "@/app/types";
import { FaPenFancy, FaPuzzlePiece } from "react-icons/fa6";
import { EditableRichText } from "../EditableTextArea";
import { FeedbackPanel } from "./FeedbackPanel";
import { TaskSwitcher } from "./TaskSwitcher";

const MyPdfHighlighter = dynamic(
  () =>
    import("@/app/components/games/WritingTrainer/PdfEditor").then(
      (mod) => mod.MyPdfHighlighter
    ),
  { ssr: false }
);
export const EditorGame = ({
  showPDF,
  setShowPDF,
}: {
  showPDF: boolean;
  setShowPDF: (val: boolean) => void;
}) => {
  const [editorContent, setEditorContent] = useState<EditorContent>({
    introduction: "",
    task1: "",
    task2: "",
    task3: "",
  });
  const [activeTask, setActiveTask] = useState<TaskKey>("task1");

  const { feedbacks, showErrors, setShowErrors } = useVale();

  const [highlightedRects, setHighlightedRects] = useState<
    { rect: DOMRect; color: string; key: string }[]
  >([]);

  useEffect(() => {
    setEditorContent((prev) => ({
      ...prev,
      task1: prev.task1 || STATIC_TEXT.task1,
      task2: prev.task2 || STATIC_TEXT.task2,
      task3: prev.task3 || STATIC_TEXT.task3,
    }));
  }, []);

  return (
    <div className="w-full h-full  juctify-center items-center flex flex-col gap-4">
      {/* Content */}
      <div className={`flex w-full md:flex-col gap-6 px-4 sm:px-2`}>
        {showPDF && !showErrors && (
          <>
            <MyPdfHighlighter
              highlightedRects={highlightedRects}
              setHighlightedRects={setHighlightedRects}
              setShowPDF={setShowPDF}
              showPDF={showPDF}
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </>
        )}
        {feedbacks.length > 0 && showErrors && (
          <FeedbackPanel feedbacks={feedbacks} setShowErrors={setShowErrors} />
        )}
        <div className="flex-1 flex flex-col gap-3 max-w-3xl">
          <div className="rounded-3xl shadow-xl border border-white/20 backdrop-blur-md bg-white/60 px-4 py-2 space-y-2 transition-all hover:shadow-2xl">
            <TaskSwitcher
              activeTask={activeTask}
              setActiveTask={setActiveTask}
            />

            <div className="bg-white/80 p-2 rounded-2xl shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-900 font-semibold text-base">
                <FaPuzzlePiece />
                {TASK_LABELS[activeTask]}
              </div>
              <div className="w-full">
                <EditableRichText
                  staticFallback={STATIC_TEXT[activeTask]}
                  value={editorContent[activeTask]}
                  onChange={(val) =>
                    setEditorContent((prev) => ({
                      ...prev,
                      [activeTask]: val,
                    }))
                  }
                />
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-2xl shadow-md flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-900 font-semibold text-base">
                <FaPenFancy />
                Introduction
              </div>
              <div className="w-full">
                <EditableRichText
                  animatedValue="Schreibe eine Einleitung für den Text..."
                  value={editorContent.introduction || ""}
                  onChange={(val) =>
                    setEditorContent((prev) => ({ ...prev, introduction: val }))
                  }
                />
              </div>
            </div>

            <div className="w-full sm:min-w-0">{/* <Editor /> */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
