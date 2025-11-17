import { COURSE_TYPES } from "@/app/models/course-types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, createCommand } from "lexical";
import { useEffect, useState } from "react";

export const SUBMIT_EVALUATION_COMMAND = createCommand("SUBMIT_EVALUATION");

interface Props {
  setEvaluation: any;
  evaluation: any;
}

export function EvaluatePlugin({ setEvaluation, evaluation }: Props) {
  const [editor] = useLexicalComposerContext();
  // const [evaluation, setEvaluation] = useState(null);
  const [subMetrics, setSubMetrics] = useState(null);

  const [showResultButton, setShowResultButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("🏁 Registering SUBMIT_EVALUATION_COMMAND");

    const unregister = editor.registerCommand(
      SUBMIT_EVALUATION_COMMAND,
      () => {
        console.log("🚀 SUBMIT_EVALUATION_COMMAND triggered");

        editor.getEditorState().read(() => {
          const currentText = $getRoot().getTextContent();
          console.log("🧾 Extracted text from editor:", currentText);

          if (currentText.trim().length > 20) {
            console.log("✅ Text length OK, sending to evaluateText()");
            evaluateText(currentText.trim());
          } else {
            console.warn("⛔ Text too short for evaluation");
          }
        });

        return true;
      },
      0
    );

    return () => {
      console.log("🧹 Unregistering SUBMIT_EVALUATION_COMMAND");
      unregister();
    };
  }, [editor]);

  const evaluateText = async (text: string) => {
    try {
      const res = await fetch(
        "https://aibackend-v2.ashydune-3e10b132.westeurope.azurecontainerapps.io/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            text_type: COURSE_TYPES.LESERBRIEF,
            task: "Schreibe einen Leserbrief an eine Tageszeitung zum Thema „Soziale Medien – Fluch oder Segen?“ Reagiere dabei auf die Aussagen in der Textbeilage und bringe deine eigene Meinung zum Ausdruck.",
          }),
        }
      );

      console.log("📬 Response status:", res.status);

      if (!res.ok) {
        const err = await res.json();
        console.error("❌ Backend returned error:", err);
        return;
      }

      const data = await res.json();
      console.log("✅ Received data:", data);

      setEvaluation(data.response.evaluation);
      setSubMetrics(data.response.sub_metrics);
      setShowResultButton(true);
    } catch (e) {
      console.error("💥 Evaluation failed:", e);
    }
  };

  return (
    <>
      {!showResultButton ? (
        <button
          onClick={() => {
            editor.dispatchCommand(SUBMIT_EVALUATION_COMMAND, undefined);
          }}
          className="mt-4  bold-button inline-flex !text-[16px] items-center justify-center gap-2 !px-3 !py-2 sm:!px-3 sm:!py-1 sm:!text-base bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold !rounded-full shadow hover:shadow-lg hover:scale-105 transition whitespace-nowrap border border-orange-500"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4  bold-button inline-flex !text-[16px] items-center justify-center gap-2 !px-3 !py-2 sm:!px-3 sm:!py-1 sm:!text-base bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold !rounded-full shadow hover:shadow-lg hover:scale-105 transition whitespace-nowrap border border-orange-500"
        >
          See result
        </button>
      )}
    </>
  );
}
