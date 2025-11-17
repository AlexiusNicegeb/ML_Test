import { cloneDeep } from "lodash";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type Props = {
  editorContent: any;
  showPDF?: boolean;
  setShowPDF?: React.Dispatch<React.SetStateAction<boolean>>;
  highlightedRects: { rect: DOMRect; color: string; key: string }[];
  setHighlightedRects: React.Dispatch<
    React.SetStateAction<{ rect: DOMRect; color: string; key: string }[]>
  >;
  setEditorContent: React.Dispatch<React.SetStateAction<any>>;
  activeRound?: number;
};

export const MyPdfHighlighter = ({
  editorContent,
  showPDF,
  setShowPDF,
  highlightedRects,
  setHighlightedRects,
  setEditorContent,
  activeRound,
}: Props) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("yellow");
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const viewerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>(580);

  const sectionMap: Record<string, keyof typeof editorContent> = {
    // red: "introduction",
    yellow: "task1",
    green: "task2",
    blue: "task3",
  };

  const deleteSelection = (key: string) => {
    const editorContentClone = cloneDeep(editorContent);
    if (editorContentClone[activeRound]) {
      editorContentClone[activeRound][key] = "";
      setEditorContent(editorContentClone);
      setHighlightedRects((prev) =>
        prev.filter((rect) => {
          const currentColor = Object.entries(sectionMap).find(
            ([, v]) => v === key
          );
          return rect.color !== currentColor?.[0];
        })
      );
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText) return;

    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    if (!rect) return;

    const section = sectionMap[selectedColor];

    setEditorContent((prev: any) => {
      const roundData = prev[activeRound] || {
        // introduction: "",
        task1: "",
        task2: "",
        task3: "",
      };

      const prevText = roundData[section] || "";
      const newText = prevText
        ? `${prevText.trim()}\n${selectedText.trim()}`
        : selectedText;

      return {
        ...prev,
        [activeRound]: {
          ...roundData,
          [section]: newText,
        },
      };
    });

    const containerRect = viewerRef?.current?.getBoundingClientRect();
    const scrollTop = viewerRef.current?.scrollTop || 0;
    const scrollLeft = viewerRef.current?.scrollLeft || 0;

    if (!containerRect) return;

    setHighlightedRects((prev: any) => [
      ...prev,
      {
        rect: {
          top: rect.top - containerRect.top + scrollTop,
          left: rect.left - containerRect.left + scrollLeft,
          width: rect.width,
          height: rect.height,
        },
        color: selectedColor,
        key: `${selectedText}-${Date.now()}`,
      },
    ]);

    selection?.removeAllRanges();
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const colorStyles: Record<string, string> = {
    // red: "#dc2626",
    yellow: "#ca8a04",
    green: "#15803d",
    blue: "#1d4ed8",
  };

  const containerClass = useMemo(() => {
    return showPDF
      ? "fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto p-4 touch-none"
      : "relative h-[660px] max-w-[620px] overflow-auto mb-10 rounded-2xl border bg-white/70 backdrop-blur p-2";
  }, [showPDF]);

  useEffect(() => {
    if (isMobileView) {
      setPageWidth(window.innerWidth * 1.1);
    } else if (showPDF) {
      setPageWidth(window.innerWidth / 2.2);
    } else {
      setPageWidth(580);
    }
  }, [showPDF, isMobileView]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const preventZoom = (e: any) => {
      if (e.ctrlKey || e.metaKey || e.type === "gesturestart") {
        e.preventDefault();
      }
    };

    const preventKeyZoom = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=")
      ) {
        e.preventDefault();
      }
    };

    if (showPDF) {
      window.addEventListener("wheel", preventZoom, { passive: false });
      window.addEventListener("gesturestart", preventZoom, { passive: false });
      window.addEventListener("keydown", preventKeyZoom);
    }

    return () => {
      window.removeEventListener("wheel", preventZoom);
      window.removeEventListener("gesturestart", preventZoom);
      window.removeEventListener("keydown", preventKeyZoom);
    };
  }, [showPDF]);

  const pdfMap: Record<number, string> = {
    1: "/pdf/LB1.pdf",
    4: "/pdf/LB1.pdf",
    2: "/pdf/LB2.pdf",
    5: "/pdf/LB2.pdf",
    3: "/pdf/LB3.pdf",
    6: "/pdf/LB3.pdf",
  };

  const pdfFile = pdfMap[activeRound] || "/pdf/default.pdf";

  return (
    <div ref={viewerRef} className={containerClass} onMouseUp={handleMouseUp}>
      <div className="mb-4 flex gap-3">
        {[
          // { color: "red", label: "Introduction", key: "introduction" },
          { color: "yellow", label: "Aufgabe 1", key: "task1" },
          { color: "green", label: "Aufgabe 2", key: "task2" },
          { color: "blue", label: "Aufgabe 3", key: "task3" },
        ].map(({ color, label, key }) => (
          <Fragment key={key}>
            <button
              onClick={() => setSelectedColor(color)}
              className={`px-3 py-2 sm:px-2 sm:py-1 rounded-full text-white text-sm font-semibold shadow-md transition-transform
        ${selectedColor === color ? "scale-105 ring-1 ring-offset-1 ring-black" : "opacity-70 hover:opacity-100"}
        ${
          color === "red"
            ? "bg-red-500"
            : color === "yellow"
              ? "bg-yellow-600 text-black"
              : color === "green"
                ? "bg-green-500"
                : "bg-blue-500"
        }`}
            >
              {label}
            </button>
            {(editorContent[key] || editorContent[activeRound]?.[key]) && (
              <button onClick={() => deleteSelection(key)}>
                Auswahl löschen
              </button>
            )}
          </Fragment>
        ))}
      </div>

      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {isMobileView
          ? Array.from({ length: numPages || 0 }).map((_, i) => (
              <div key={`page-${i}`} className="flex justify-center mb-6">
                <Page pageNumber={i + 1} width={pageWidth} />
              </div>
            ))
          : Array.from({ length: Math.ceil((numPages || 0) / 2) }).map(
              (_, i) => {
                const page1 = i * 2 + 1;
                const page2 = page1 + 1;
                return (
                  <div
                    key={`spread-${i}`}
                    className="flex justify-center items-start gap-6 mb-6"
                  >
                    {page1 <= (numPages || 0) && (
                      <Page pageNumber={page1} width={pageWidth / 1.2} />
                    )}
                    {page2 <= (numPages || 0) && (
                      <Page pageNumber={page2} width={pageWidth / 1.2} />
                    )}
                  </div>
                );
              }
            )}
      </Document>

      {/* Overlay highlights */}
      {highlightedRects.map(({ rect, color, key }) => (
        <div
          key={key}
          style={{
            position: "absolute",
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            backgroundColor: colorStyles[color] + "33",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      ))}
      {showPDF && (
        <button
          onClick={() => {
            setShowPDF(false);
          }}
          className={` ${isMobileView ? "fixed bottom-4" : "absolute top-4"}  right-4 bg-black text-white px-4 sm:px-2 py-2 sm:py-1 sm:text-xs rounded-lg z-50 hover:bg-gray-800`}
        >
          Schließen
        </button>
      )}
    </div>
  );
};
