import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { $getRoot, createCommand } from "lexical";
import { getAllTextNodes } from "../utils/editorUtils";
import { removeStyleFragment } from "./ValePlugin";
import { useFeedback } from "@/app/hooks/useLanguageToolFeedback";

export const FAIL_LIFE_COMMAND = createCommand();
export const GOOD_FEEDBACK_COMMAND = createCommand();
export const ERROR_FEEDBACK_COMMAND = createCommand();

export function FeedbackPlugin() {
  const [editor] = useLexicalComposerContext();
  const isDecorated = useRef(false);
  const hidePopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTextRef = useRef("");

  const {
    decorateErrors,
    feedbacks,
    popupPos,
    activeFeedback,
    setActiveFeedback,
    setPopupPos,
    applySuggestion,
    fetchErrors,
    detectLanguage,
  } = useFeedback(editor);

  useEffect(() => {
    const root = editor.getRootElement();
    const OFFSET = 8;

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const key = el?.getAttribute("data-node-key");
      if (!key) return;

      if (hidePopupTimerRef.current) clearTimeout(hidePopupTimerRef.current);

      editor.read(() => {
        const fb = feedbacks?.find((f) => f.nodeKeys?.includes(key));
        if (fb) {
          const rect = el.getBoundingClientRect();
          const popupHeight = popupRef.current?.offsetHeight || 40;

          setPopupPos({
            top: rect.top + window.scrollY - popupHeight - OFFSET,
            left: rect.left + window.scrollX,
          });

          setActiveFeedback((prev) => (prev?.id !== fb.id ? fb : prev));
        }
      });
    };

    const onMouseOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement;

      if (
        !el?.getAttribute("data-node-key") ||
        related?.getAttribute("data-node-key") ||
        popupRef.current?.contains(related)
      )
        return;

      hidePopupTimerRef.current = setTimeout(() => {
        setActiveFeedback(null);
      }, 2000);
    };

    root?.addEventListener("mouseover", onMouseOver);
    root?.addEventListener("mouseout", onMouseOut);
    return () => {
      root?.removeEventListener("mouseover", onMouseOver);
      root?.removeEventListener("mouseout", onMouseOut);
    };
  }, [editor, feedbacks]);

  useEffect(() => {
    const onHighlightClick = (e: any) => {
      const key = e.detail.nodeKey;
      const el = document.querySelector(
        `[data-node-key="${key}"]`
      ) as HTMLElement;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });

      const fb = feedbacks?.find((f) => f.nodeKeys?.includes(key));
      setActiveFeedback(fb || null);
    };

    const root = editor.getRootElement();
    root?.addEventListener("highlight-click", onHighlightClick);
    return () => root?.removeEventListener("highlight-click", onHighlightClick);
  }, [editor, feedbacks]);

  const previousHash = useRef<string | null>(null);
  useEffect(() => {
    const hash = JSON.stringify(feedbacks);
    if (hash === previousHash.current) return;
    previousHash.current = hash;

    const timeout = setTimeout(() => {
      if (feedbacks?.length) {
        decorateErrors();
        isDecorated.current = true;
      } else if (isDecorated.current) {
        editor.update(() => {
          getAllTextNodes($getRoot()).forEach((n) => {
            removeStyleFragment(n, "underline wavy red");
            removeStyleFragment(n, "background-color: rgba(255,0,0,0.1)");
          });
        });
        isDecorated.current = false;
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [feedbacks, editor]);

  useEffect(() => {
    const triggerChars = [".", "!", "?", ";"];
    let idleCallback: number | null = null;

    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const currentText = $getRoot().getTextContent();
        if (currentText === prevTextRef.current) return;
        prevTextRef.current = currentText;

        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        debounceTimerRef.current = setTimeout(() => {
          const run = () =>
            fetchErrors(currentText, detectLanguage(currentText));
          if ("requestIdleCallback" in window) {
            idleCallback = requestIdleCallback(run, { timeout: 1000 });
          } else {
            run();
          }
        }, 800);
      });
    });

    return () => {
      unregister();
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (idleCallback) cancelIdleCallback(idleCallback);
    };
  }, [editor, feedbacks]);

  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;

    const onEnter = () => {
      if (hidePopupTimerRef.current) clearTimeout(hidePopupTimerRef.current);
    };
    const onLeave = () => {
      hidePopupTimerRef.current = setTimeout(() => {
        setActiveFeedback(null);
      }, 2000);
    };

    popup.addEventListener("mouseenter", onEnter);
    popup.addEventListener("mouseleave", onLeave);
    return () => {
      popup.removeEventListener("mouseenter", onEnter);
      popup.removeEventListener("mouseleave", onLeave);
    };
  }, [activeFeedback]);

  useEffect(() => {
    if (!activeFeedback) return;
    const stillExists = feedbacks?.some(
      (f) =>
        f.offset === activeFeedback.offset &&
        f.length === activeFeedback.length &&
        f.originalText === activeFeedback.originalText
    );
    if (!stillExists) setActiveFeedback(null);
  }, [feedbacks, activeFeedback]);

  if (!feedbacks?.length) return null;

  return (
    <div className="max-w-7xl w-full mt-4 rounded-3xl bg-white backdrop-blur-sm shadow-md border border-[#d0e7ff] hover:shadow-lg transition-all duration-300 relative z-10">
      {activeFeedback && popupPos && (
        <div
          ref={popupRef}
          className="absolute z-50 bg-white rounded-xl border border-[#d0e7ff] shadow-md transition-all duration-300 p-2 text-sm font-semibold"
          style={{
            top: "-418px",
            right: "20px",
            minWidth: "120px",
            maxWidth: "240px",
          }}
        >
          {activeFeedback.replacements?.map((r, idx) => (
            <button
              key={idx}
              onClick={() => applySuggestion(activeFeedback, r)}
              className="block w-full text-left text-orange-500 hover:text-orange-600 hover:underline px-2 py-1 rounded-lg"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        <h4 className="font-extrabold text-lg text-[#000] mb-2 drop-shadow-sm">
          Errors:
        </h4>
        <ul className="space-y-2">
          {feedbacks.map((item) => (
            <li
              key={item.id}
              className="text-base text-[#00A6F4] font-semibold"
            >
              {item.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
