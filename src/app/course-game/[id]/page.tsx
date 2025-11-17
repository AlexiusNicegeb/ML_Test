"use client";
import { MyPdfHighlighter } from "@/app/components/games/WritingTrainer/PdfEditor";
import withProtectedUserPage from "@/app/context/user/withProtectedUserPage";
import { COURSE_TYPES } from "@/app/models/course-types";
import { LoadingSpinner } from "@/app/ui/components/LoadingSpinner";
import {
  fetchEnrolled,
  getCourseTypeResults,
  saveWatchedAttempt,
} from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { $getRoot, ParagraphNode, TextNode } from "lexical";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBolt, FaPenFancy, FaSpinner } from "react-icons/fa6";
import { toast } from "react-toastify";
import Editor from "../../components/games/WordGame/Editor";
import ExampleTheme from "../../components/games/WordGame/ExampleTheme";
import { gradientThemes, IS_PRODUCTION } from "../../constants";
import { EditorConfig } from "../../hooks/useGameState";
import { STATIC_TEXT } from "../../staticData";
import { EditorContent, TaskKey } from "../../types";
import { Button } from "../../ui/components/Button";
import {
  ButtonConfig,
  ControlButton,
} from "../../ui/components/EditorGame/ControlButton";
import { TaskSwitcher } from "../../ui/components/EditorGame/TaskSwitcher";
import LockedTooltipModal from "../../ui/components/LockedTooltipModal";
import { ResultModal } from "../../ui/components/ResultModal/ResultModal";
import VictoryModal from "../../ui/components/WordGame/VictoryModal";
import { VideoSection } from "../../ui/components/WordGame/VideoSection";

const editorConfig: EditorConfig = {
  namespace: "KrazyEditor",
  nodes: [ParagraphNode, TextNode, ListNode, ListItemNode],
  onError: (error: Error) => {
    throw error;
  },
  theme: ExampleTheme,
  html: {},
};
const FullTaskViewer = dynamic(() => import("../../../lib/FullTaskViewer"), {
  ssr: false,
});

function CourseGame() {
  const router = useRouter();
  const [activeTask, setActiveTask] = useState<TaskKey>("task1");
  const [loading, setLoading] = useState<boolean>(false);
  const [evaluationsByRound, setEvaluationsByRound] = useState<
    Record<number, Record<string, any>>
  >({});
  const [subMetricsByRound, setSubMetricsByRound] = useState<
    Record<number, Record<string, any>>
  >({});
  const [courseCompleted, setCourseCompleted] = useState<boolean>(false);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [videoWatched, setVideoWatched] = useState<Record<number, boolean>>({});
  const [taskSubmitted, setTaskSubmitted] = useState<
    Record<number, Record<string, boolean>>
  >({});

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const [activeRound, setActiveRound] = useState<number>(1);
  const [lexicalEditor, setLexicalEditor] = useState<any>(null);
  const [subMetrics, setSubMetrics] = useState<any>(null);
  const [showResultButton, setShowResultButton] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showPDF, setShowPDF] = useState<boolean>(false);
  const [highlightedRects, setHighlightedRects] = useState<
    { rect: DOMRect; color: string; key: string }[]
  >([]);
  const MAX_ROUNDS = 6;
  const currentUrl = videoUrls[currentVideoIndex] || " ";
  const params = useParams();

  const [editorContent, setEditorContent] = useState<
    Record<number, EditorContent>
  >({
    1: { introduction: "", task1: "", task2: "", task3: "" },
  });
  const [pdfContent, setPdfContent] = useState<
    Record<
      number,
      { introduction: string; task1: string; task2: string; task3: string }
    >
  >({
    1: { introduction: "", task1: "", task2: "", task3: "" },
  });

  const [showFullTask, setShowFullTask] = useState(false);

  const isRoundUnlocked = (round: number) => {
    if (round === 1) return true;
    const prev = round - 1;
    const submittedTasks = taskSubmitted[prev] || {};
    return (
      videoWatched[prev] &&
      ["task1", "task2", "task3"].every((task) => submittedTasks[task])
    );
  };

  const buttons: ButtonConfig[] = Array.from({
    length: MAX_ROUNDS,
  }).map((_, idx) => {
    const round = idx + 1;
    const unlocked = isRoundUnlocked(round);

    return {
      label: `Runde ${round}`,
      icon: <FaBolt />,
      gradientFrom:
        Object.values(gradientThemes)[
          idx % Object.keys(gradientThemes).length
        ][0],
      gradientTo:
        Object.values(gradientThemes)[
          idx % Object.keys(gradientThemes).length
        ][1],
      disabled: !unlocked,
      onClick: () => {
        if (!unlocked) {
          setActiveRound(round);
        }
      },
    };
  });
  useEffect(() => {
    if (showFullTask) {
      //disable body scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showFullTask]);

  const evaluateText = async (text: string) => {
    const taskText = STATIC_TEXT[activeTask];

    const res = await fetch(
      "https://aibackend-v2.ashydune-3e10b132.westeurope.azurecontainerapps.io/evaluate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          text_type: COURSE_TYPES.LESERBRIEF,
          task: taskText,
        }),
      }
    );

    const data = await res.json();
    const evalResult = data.response.evaluation;
    const subResult = data.response.sub_metrics;

    setEvaluation(evalResult);
    setSubMetrics(subResult);
    setShowResultButton(true);
    setIsModalOpen(true);
    setEvaluationsByRound((prev) => ({
      ...prev,
      [activeRound]: {
        ...(prev[activeRound] || {}),
        [activeTask]: evalResult,
      },
    }));

    setSubMetricsByRound((prev) => ({
      ...prev,
      [activeRound]: {
        ...(prev[activeRound] || {}),
        [activeTask]: subResult,
      },
    }));

    return { evaluation: evalResult, subMetrics: subResult };
  };

  useEffect(() => {
    setEvaluation(evaluationsByRound[activeRound] || null);
    setSubMetrics(subMetricsByRound[activeRound] || null);
    setShowResultButton(!!evaluationsByRound[activeRound]);
  }, [activeRound, evaluationsByRound, subMetricsByRound]);

  useEffect(() => {
    const isSubmitted = taskSubmitted?.[activeRound]?.[activeTask];
    const hasEval = !!evaluationsByRound?.[activeRound];

    if (isSubmitted && hasEval) {
      setShowResultButton(true);
    } else {
      setShowResultButton(false);
    }

    setEvaluation(evaluationsByRound?.[activeRound] || null);
    setSubMetrics(subMetricsByRound?.[activeRound] || null);
  }, [
    activeTask,
    activeRound,
    evaluationsByRound,
    subMetricsByRound,
    taskSubmitted,
  ]);

  const handleSubmit = async () => {
    if (!lexicalEditor || loading) return;
    setLoading(true);

    lexicalEditor.getEditorState().read(async () => {
      const content = $getRoot().getTextContent().trim();

      if (content.length <= 20) {
        toast.error("Text is too short!");
        return;
      }

      const { evaluation, subMetrics } = await evaluateText(content);

      const payload = {
        task: activeTask,
        round: activeRound,
        courseId: params.id,
        answers: {
          [activeTask]: content,
        },
        textType: COURSE_TYPES.LESERBRIEF,
        evaluation,
        subMetrics,
      };

      try {
        const res = await fetch("/api/attempt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`Save failed: ${res.status}`);

        toast.success("Resultat gespeichert!");
        setLoading(false);

        setTaskSubmitted((prev) => ({
          ...prev,
          [activeRound]: {
            ...(prev[activeRound] || {}),
            [activeTask]: true,
          },
        }));
      } catch (e) {
        console.error(e);
        toast.error("Failed to save result.");
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const loadList = async () => {
      const res = await fetch(`/api/list-videos?module=Module${activeRound}`);
      const { videos } = await res.json();
      setVideoUrls(videos);
      setCurrentVideoIndex(0);
    };
    loadList();
  }, [activeRound]);

  useEffect(() => {
    const submitted = taskSubmitted[MAX_ROUNDS];
    const allSubmitted =
      videoWatched[MAX_ROUNDS] &&
      submitted &&
      ["task1", "task2", "task3"].every((task) => submitted[task]);

    if (allSubmitted) {
      setCourseCompleted(true);
    }
  }, [taskSubmitted, videoWatched]);

  useEffect(() => {
    const isSubmitted = taskSubmitted?.[activeRound]?.[activeTask];
    const evalResult = evaluationsByRound?.[activeRound]?.[activeTask];
    const subResult = subMetricsByRound?.[activeRound]?.[activeTask];

    if (isSubmitted && evalResult) {
      setShowResultButton(true);
    } else {
      setShowResultButton(false);
    }

    setEvaluation(evalResult || null);
    setSubMetrics(subResult || null);
  }, [
    activeTask,
    activeRound,
    evaluationsByRound,
    subMetricsByRound,
    taskSubmitted,
  ]);

  useEffect(() => {
    if (!IS_PRODUCTION) return;

    const warnBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const patchCompletedRounds = (courseTypeResults) => {
    if (courseTypeResults.length === 0) return;

    const sortedResult = courseTypeResults.sort((a, b) => a.round - b.round);
    const lastCompletedRound = sortedResult[sortedResult.length - 1];

    const newRound =
      lastCompletedRound.evaluation.history.length === 3
        ? lastCompletedRound.round + 1
        : lastCompletedRound.round;

    setActiveRound(newRound);

    setTaskSubmitted((prev) => {
      return Object.fromEntries(
        Array.from({ length: newRound }, (_, i) => [
          i + 1,
          {
            task1: !!courseTypeResults[i]?.evaluation.history.find(
              (h) => h.task === "task1"
            ),
            task2: !!courseTypeResults[i]?.evaluation.history.find(
              (h) => h.task === "task2"
            ),
            task3: !!courseTypeResults[i]?.evaluation.history.find(
              (h) => h.task === "task3"
            ),
          },
        ])
      );
    });

    setVideoWatched(() => {
      return Object.fromEntries(
        Array.from({ length: newRound }, (_, i) => [
          i + 1,
          courseTypeResults[i]?.watched || false,
        ])
      );
    });

    setEditorContent((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Array.from({ length: newRound }, (_, i) => [
          i + 1,
          {
            task1: courseTypeResults[i]?.contents["task1"] || undefined,
            task2: courseTypeResults[i]?.contents["task2"] || undefined,
            task3: courseTypeResults[i]?.contents["task3"] || undefined,
          },
        ])
      ),
    }));

    const nextTask = lastCompletedRound.evaluation.history.length + 1;
    setActiveTask(("task" + (nextTask > 3 ? 1 : nextTask)) as TaskKey);
  };

  useEffect(() => {
    Promise.all([getCourseTypeResults(+params.id), fetchEnrolled()])
      .then(([courseTypeResults, enrolledData]) => {
        if (
          !enrolledData ||
          (!enrolledData.courses.find((e) => e.course.id === +params.id) &&
            !enrolledData.packages.find((p) => p.courseId === +params.id))
        ) {
          router.replace("/");
          return;
        }

        patchCompletedRounds(courseTypeResults);
        setLoadingCourse(false);
      })
      .catch((error) => {
        console.error("Failed to load course data:", error);
        router.replace("/");
      });
  }, []);

  const introductionPlaceholder =
    "Öffne das PDF, markiere Text und füge hier deine Notizen ein.";

  const handleOnVideoWatched = () => {
    setVideoWatched((prev) => ({ ...prev, [activeRound]: true }));
    toast.success("Großartig, weiter so.");
    saveWatchedAttempt(+params.id, activeRound);
  };

  if (loadingCourse) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex justify-center py-10 min-h-[85vh] bg-gradient-to-br from-[#bfdbfe] via-[#93c5fd] to-[#7dd3fc] relative ">
      <div className="max-w-7xl w-full flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 md:flex-wrap">
          {buttons.map((btn, idx) => {
            const round = idx + 1;
            const unlocked = isRoundUnlocked(round);
            const isLocked = !unlocked;

            return (
              <div key={idx} className="relative group">
                <ControlButton
                  {...btn}
                  disabled={!isMobile && isLocked}
                  className={isLocked ? "opacity-50" : ""}
                  onClick={() => {
                    if (unlocked) {
                      setActiveRound(round);
                      setActiveTask("task1");
                    } else if (isMobile) {
                      setShowLockedModal(true);
                    }
                  }}
                />

                {isLocked && (
                  <div className="absolute lg:hidden -top-20 left-1/2 -translate-x-1/2 z-10 w-max whitespace-pre-wrap bg-black text-white text-sm px-4 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center pointer-events-none sm:text-xs">
                    Um diesen Round freizuschalten musst du:
                    <br />
                    das Einführungsvideo ansehen
                    <br /> <b>und alle 3 Aufgaben</b> abschicken
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <LexicalComposer initialConfig={editorConfig}>
          <div className="flex gap-6 mt-8 items-center justify-center lg:flex-col w-full">
            <VideoSection
              onVideoWatched={handleOnVideoWatched}
              videoUrl={currentUrl}
              videoName={`Einführungsvideo Runde ${activeRound}`}
              videoCount={videoUrls.length}
              currentIndex={currentVideoIndex}
              onSelectIndex={setCurrentVideoIndex}
            />
            <div className="lg:w-full flex-1 rounded-3xl shadow-xl border border-white/20 backdrop-blur-md bg-white/60 px-4 py-2  space-y-2 transition-all hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <TaskSwitcher
                  activeRound={activeRound}
                  taskSubmitted={taskSubmitted}
                  activeTask={activeTask}
                  setActiveTask={setActiveTask}
                />
                <Button onClick={() => setShowFullTask(true)}>Anleitung</Button>
              </div>
              {/* <div className="bg-white/80 p-2 rounded-2xl shadow-md flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-base">
                  <FaPuzzlePiece />
                  {TASK_LABELS[activeTask]}
                </div>
                <div className="w-full max-w-full">
                  <EditableRichText
                    staticFallback={currentTitle}
                    value={pdfContent[activeRound]?.[activeTask] ?? ""}
                    onChange={(val) =>
                      setPdfContent((prev) => ({
                        ...prev,
                        [activeRound]: {
                          ...(prev[activeRound] || {
                            introduction: "",
                            task1: "",
                            task2: "",
                            task3: "",
                          }),
                          [activeTask]: val,
                        },
                      }))
                    }
                  />
                </div>
              </div> */}

              <div className="bg-white/80 p-2 rounded-2xl shadow-md flex flex-col gap-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-base">
                  <FaPenFancy />
                  Notizen aus dem PDF
                </div>
                <div className="w-full">
                  {!pdfContent[activeRound]?.task1 &&
                    !pdfContent[activeRound]?.task2 &&
                    !pdfContent[activeRound]?.task3 &&
                    introductionPlaceholder}

                  {activeTask === "task1" && pdfContent[activeRound]?.task1 && (
                    <div className="mb-3">
                      <h3 className="font-semibold mb-1">
                        Notizen zu Aufgabe 1:
                      </h3>
                      <p>{pdfContent[activeRound]?.task1}</p>
                    </div>
                  )}

                  {activeTask === "task2" && pdfContent[activeRound]?.task2 && (
                    <div className="mb-3">
                      <h3 className="font-semibold mb-1">
                        Notizen zu Aufgabe 2:
                      </h3>
                      <p>{pdfContent[activeRound]?.task2}</p>
                    </div>
                  )}

                  {activeTask === "task3" && pdfContent[activeRound]?.task3 && (
                    <div className="mb-3">
                      <h3 className="font-semibold mb-1">
                        Notizen zu Aufgabe 3:
                      </h3>
                      <p>{pdfContent[activeRound]?.task3}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full sm:min-w-0 -z-0">
                <Editor
                  key={`${activeRound}-${activeTask}`}
                  setEditor={setLexicalEditor}
                  value={editorContent[activeRound]?.[activeTask] ?? ""}
                  onChange={(text) => {
                    setEditorContent((prev) => ({
                      ...prev,
                      [activeRound]: {
                        ...prev[activeRound],
                        [activeTask]: text,
                      },
                    }));
                  }}
                />
                <div className="flex mt-4 justify-between items-center">
                  <div className=" z-50 flex-1 flex w-full  gap-3">
                    {!showResultButton ? (
                      <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                          <div className="w-[100px] flex justify-center items-center gap-2 animate-spin">
                            <FaSpinner />
                          </div>
                        ) : (
                          "Abschicken"
                        )}
                      </Button>
                    ) : (
                      <Button onClick={() => setIsModalOpen(true)}>
                        Resultat ansehen
                      </Button>
                    )}
                    {showResultButton && (
                      <Button
                        onClick={() => {
                          setShowResultButton(false);
                          setEvaluation(null);
                        }}
                      >
                        Nochmal abschicken
                      </Button>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPDF(true)}
                  >
                    PDF öffnen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </LexicalComposer>
      </div>

      {isModalOpen && (
        <ResultModal
          evaluation={evaluation}
          subMetrics={subMetrics}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {courseCompleted && (
        <VictoryModal
          show={true}
          onClose={() => {
            setCourseCompleted(false);
            router.push("/result");
          }}
          title="🎉 Du hast den Kurs abgeschlossen!"
          description={`Fantastisch! Du hast alle ${MAX_ROUNDS} Runden erfolgreich gemeistert. Zeit, deine Ergebnisse anzuschauen.`}
          buttonText="Zur Auswertung"
          imageSrc="/robot3.png"
        />
      )}

      <LockedTooltipModal
        visible={showLockedModal}
        onClose={() => setShowLockedModal(false)}
      />

      <>
        {showPDF && (
          <MyPdfHighlighter
            highlightedRects={highlightedRects}
            setHighlightedRects={setHighlightedRects}
            setShowPDF={setShowPDF}
            showPDF={showPDF}
            editorContent={pdfContent}
            setEditorContent={setPdfContent}
            activeRound={activeRound}
          />
        )}
      </>
      {showFullTask && (
        <FullTaskViewer
          round={activeRound}
          task={formatTaskNumber(activeTask)}
          onClose={() => setShowFullTask(false)}
        />
      )}
    </div>
  );
}

export default withProtectedUserPage(CourseGame);

function formatTaskNumber(taskNumber: string): number {
  switch (taskNumber) {
    case "task1":
      return 1;
    case "task2":
      return 2;
    case "task3":
      return 3;

    default:
      break;
  }
}
