"use client";
import mammoth from "mammoth";
import { useEffect, useState } from "react";

export default function FullTaskViewer({ round, task, onClose }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch(`/docs/AufgabenLB${round}.${task}.docx`)
      .then((r) => r.arrayBuffer())
      .then((buf) =>
        mammoth.convertToHtml(
          { arrayBuffer: buf },
          {
            convertImage: mammoth.images.imgElement((element) => {
              return element.read("base64").then((b64) => {
                return { src: `data:${element.contentType};base64,${b64}` };
              });
            }),
          }
        )
      )
      .then((res) => setHtml(res.value))
      .catch((e) => console.error("Mammoth error:", e));
  }, [round, task]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-h-[90vh] overflow-auto w-[80vw]">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
Close
        </button>
      </div>
    </div>
  );
}
