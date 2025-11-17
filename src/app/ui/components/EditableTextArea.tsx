import React, { useState, useRef, useEffect } from "react";
import { useTypeWriter } from "@/app/hooks/useTypeWriter";

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  staticFallback?: string;

  animatedValue?: string;
};

export const EditableRichText = ({
  value,
  onChange,
  placeholder = "",
  className = "",
  staticFallback = "",
  animatedValue = "",
}: Props) => {
  const [editing, setEditing] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const typed = useTypeWriter(animatedValue);
  const [hasEdited, setHasEdited] = useState<boolean>(false);

  useEffect(() => {
    if (editing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [editing]);

  const handleBlur = () => {
    const text = contentRef.current?.innerText || "";
    onChange(text.trim());
    setHasEdited(true);
    setEditing(false);
  };

  const combinedValue = (() => {
    if (editing) {
      return value || (!hasEdited && (animatedValue || staticFallback)) || "";
    }

    if (animatedValue && !hasEdited) {
      return `<span class="text-gray-800">${typed}</span>${value}`;
    }

    return value || staticFallback || "";
  })();

  return (
    <div
      className={`w-full text-left relative ${className}`}
      onClick={() => !editing && setEditing(true)}
    >
      {!editing && !value && !typed && (
        <div className="absolute top-1 left-3 text-gray-800 italic pointer-events-none select-none">
          {placeholder}
        </div>
      )}

      <div
        ref={contentRef}
        contentEditable={editing}
        onBlur={handleBlur}
        suppressContentEditableWarning
        className={`
    w-full max-w-full min-h-[30px] p-1 rounded-lg border 
    ${editing ? "border-blue-300 bg-white" : "border-transparent bg-white/80 hover:border-blue-300"} 
    text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-sm
    whitespace-pre-wrap break-words break-all overflow-hidden word-wrap 
    transition cursor-text
  `}
        dangerouslySetInnerHTML={{ __html: combinedValue }}
      />
    </div>
  );
};
