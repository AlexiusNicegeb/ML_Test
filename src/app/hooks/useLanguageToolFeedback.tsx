import { useRef, useState } from "react";
import { Feedback } from "../types";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isTextNode,
} from "lexical";
import { franc } from "franc";
import { getAllTextNodes } from "../components/games/WordGame/utils/editorUtils";
import {
  addStyleFragment,
  removeStyleFragment,
} from "../components/games/WordGame/plugins/ValePlugin";

const langMap: Record<string, string> = {
  eng: "en-US",
  deu: "de-DE",
  fra: "fr",
  ukr: "uk-UA",
};

const detectLanguage = (text: string): string => {
  const lang = franc(text);
  return langMap[lang] || "en-US";
};

export function useFeedback(editor: any) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [activeFeedback, setActiveFeedback] = useState<Feedback | null>(null);
  const [popupPos, setPopupPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const isDecorated = useRef<boolean>(false);

  const applySuggestion = (feedback: Feedback, replacement: string) => {
    editor.update(() => {
      const root = $getRoot();
      const fullText = root.getTextContent();

      const before = fullText.slice(0, feedback.offset);
      const after = fullText.slice(feedback.offset + feedback.length);

      const newText = before + replacement + after;

      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(newText));

      root.clear();
      root.append(paragraph);

      isDecorated.current = false;
    });

    setFeedbacks((prev) => prev.filter((f) => f.id !== feedback.id));

    editor.read(() => {
      const currentText = $getRoot().getTextContent();
      fetchErrors(currentText, detectLanguage(currentText));
    });
  };

  const decorateErrors = () => {
    editor.update(() => {
      const updatedFeedbacks: Feedback[] = feedbacks?.map((fb) => ({
        ...fb,
        nodeKeys: [],
      }));

      const root = $getRoot();
      const allTextNodes = getAllTextNodes(root);

      allTextNodes.forEach((node) => {
        if ($isTextNode(node)) {
          removeStyleFragment(node, "underline wavy red");
          removeStyleFragment(node, "background-color: rgba(255,0,0,0.1)");
        }
      });

      for (const fb of updatedFeedbacks) {
        const textNodes = getAllTextNodes(root);
        let accumulatedOffset = 0;

        for (const node of textNodes) {
          if (!$isTextNode(node)) {
            continue;
          }

          const nodeLength = node.getTextContent().length;
          const nodeStart = accumulatedOffset;
          const nodeEnd = accumulatedOffset + nodeLength;

          const fbStart = fb.offset;
          const fbEnd = fb.offset + fb.length;

          if (fbEnd > nodeStart && fbStart < nodeEnd) {
            const localFbStart = Math.max(0, fbStart - nodeStart);
            let localFbEnd = Math.min(nodeLength, fbEnd - nodeStart);

            let targetNode = node;

            if (localFbStart > 0) {
              const [left, right] = targetNode.splitText(localFbStart);
              if (!right) continue;
              targetNode = right;
              localFbEnd -= localFbStart;
            }

            if (localFbEnd < targetNode.getTextContent().length) {
              targetNode.splitText(localFbEnd);
            }
            addStyleFragment(
              targetNode,
              "text-decoration: underline wavy red; background-color: rgba(255,0,0,0.1)"
            );

            const domElement = editor.getElementByKey(targetNode.getKey());
            if (domElement) {
              domElement.setAttribute("data-node-key", targetNode.getKey());
            }

            fb.nodeKeys?.push(targetNode.getKey());
          }

          accumulatedOffset += nodeLength;
        }
      }

      setFeedbacks(updatedFeedbacks);

      isDecorated.current = true;
    });
  };

  const fetchErrors = async (text: string, language: string = "en-US") => {
    const response = await fetch("/api/languagetool", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, language }),
    });
    const result = await response.json();

    const newFeedbacks: Feedback[] = result?.matches?.map((match: any) => ({
      id: Date.now() + Math.random(),
      message: match.message,
      offset: match.offset,
      length: match.length,
      replacements: match.replacements?.slice(0, 3)?.map((r: any) => r.value),
      originalText: text.substring(match.offset, match.offset + match.length),
    }));

    setFeedbacks(newFeedbacks);
  };

  return {
    applySuggestion,
    activeFeedback,
    setActiveFeedback,
    popupPos,
    setPopupPos,
    decorateErrors,
    feedbacks,
    fetchErrors,
    detectLanguage,
  };
}
