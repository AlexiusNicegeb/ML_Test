"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useRef } from "react";
import { $getRoot } from "lexical";
import { useVale } from "@/app/context/vale/ValeContext";
import { toast } from "react-toastify";

type ValeFeedback = {
  id: number;
  line: number;
  message: string;
  rule: string;
  match: string;
  span: [number, number];
};

export function addStyleFragment(node: any, fragment: string) {
  const existing = node.getStyle() || "";
  const parts = new Set(
    existing
      .split(";")
      .map((s: string) => s.trim())
      .filter(Boolean)
  );
  parts.add(fragment);
  node.setStyle([...(parts as any)].join("; "));
}

export function removeStyleFragment(node: any, fragmentContains: string) {
  const existing = node.getStyle() || "";
  const filtered = existing
    .split(";")
    .map((s: string) => s.trim())
    .filter((s: string) => !s.includes(fragmentContains));
  node.setStyle(filtered.join("; "));
}

export function ValePlugin() {
  const [editor] = useLexicalComposerContext();
  const prevTextRef = useRef<string>("");
  const { feedbacks, setFeedbacks, showErrors, setShowErrors } = useVale();

  const checkVale = async (text: string): Promise<ValeFeedback[]> => {
    const res = await fetch("/api/vale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (data.error) {
      console.error("Vale error:", data.error);
      setFeedbacks([]);
      return [];
    }

    const feedbacks: ValeFeedback[] = Object.values(
      data.result as Record<string, any[]>
    ).flatMap((arr) =>
      arr.map((item) => ({
        id: Date.now() + Math.random(),
        line: item.Line,
        message: item.Message,
        rule: item.Check,
        match: item.Match,
        span: item.Span,
      }))
    );

    setFeedbacks(feedbacks);
    return feedbacks;
  };

  const handleManualCheck = async () => {
    let text = "";

    await editor.update(() => {
      text = $getRoot().getTextContent();
    });

    if (text.length === 0) {
      return;
    }

    const feedbacks = await checkVale(text);

    if (feedbacks.length === 0) {
      toast.success("Kein Fehler gefunden!");
    }
  };

  return (
    <div className="mt-6 space-y-4 p-4 rounded-xl bg-[#e6f0ff] border border-blue-200 shadow-md">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={async () => {
            await handleManualCheck();
          }}
          className="bg-gradient-to-r   from-[#00A6F4] to-[#0087C1] text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
        >
          {feedbacks?.length > 0 ? "Recheck" : " Vale Check"}
        </button>

        {feedbacks?.length > 0 && !showErrors && (
          <button
            onClick={() => setShowErrors(true)}
            className="bg-white border border-[#00A6F4] text-[#00A6F4] font-semibold px-4 py-2 rounded-full shadow-sm hover:bg-gradient-to-r from-[#00A6F4] to-[#0087C1] hover:text-white transition-colors duration-300 text-sm"
          >
            Show {feedbacks?.length} Vale Error
            {feedbacks?.length !== 1 ? "s" : ""}
          </button>
        )}
      </div>
    </div>
  );
}
