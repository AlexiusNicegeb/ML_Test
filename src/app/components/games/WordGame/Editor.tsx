import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { FeedbackPlugin } from "./plugins/FeedbackPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const placeholder = "Hier kannst du losschreiben...";

interface EditorProps {
  setEditor: (editor: any) => void;
  value: string;
  onChange: (val: string) => void;
}

export default function Editor({ setEditor, value, onChange }: EditorProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setEditor(editor);
  }, [editor]);

  useEffect(() => {
    if (!editor || value == null) return;

    editor.update(() => {
      const root = $getRoot();
      if (root.getTextContent().trim() !== value.trim()) {
        root.clear();
        root.append($createParagraphNode().append($createTextNode(value)));
      }
    });
  }, [editor, value]);
  return (
    <div className="relative rounded-xl">
      <div className="editor-container relative">
        <ToolbarPlugin />

        <div className="editor-inner relative h-[270px] flex flex-col">
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input min-h-full outline-none px-3 py-2 whitespace-pre-wrap break-words"
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className="editor-placeholder pointer-events-none">
                      {placeholder}
                    </div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>

        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const root = $getRoot();
              const text = root.getTextContent();
              onChange(text);
            });
          }}
        />
        <FeedbackPlugin />
      </div>
    </div>
  );
}
