import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  HashtagIcon,
  ListBulletIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const LowPriority = 1;

function Divider() {
  return <div className="divider mx-2" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [activeList, setActiveList] = useState("");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Check if selection is inside a list
      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getParent();

      if (parent?.getType() === "listitem") {
        const listType = parent?.getParent()?.getType();
        setActiveList(listType ?? "");
      } else {
        setActiveList("");
      }
    }
  }, []);

  const toggleList = (command: LexicalCommand<void>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();
        const grandparent = parent?.getParent();

        if (grandparent?.getType() === "list") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(command, undefined);
        }
      }
    });
  };

  const handleSave = () => {
    const editorState = editor.getEditorState();
    const serializedState = editorState.toJSON();
    localStorage.setItem("editorState", JSON.stringify(serializedState));
    alert("Editor state saved to local storage!");
  };

  const handleLoad = () => {
    const savedState = localStorage.getItem("editorState");
    if (savedState) {
      try {
        const jsonState = JSON.parse(savedState);
        editor.update(() => {
          const newEditorState = editor.parseEditorState(jsonState);
          editor.setEditorState(newEditorState);
        });
        alert("Editor state loaded from local storage!");
      } catch (e) {
        console.error("Failed to load editor state:", e);
        alert("Failed to load editor state!");
      }
    } else {
      alert("No saved editor state found!");
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read($updateToolbar);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar flex items-center p-2" ref={toolbarRef}>
      {/* Undo & Redo */}
      <button
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className="toolbar-item spaced p-1 rounded hover:bg-gray-200 disabled:opacity-50"
        aria-label="Undo"
      >
        <ArrowUturnLeftIcon className="h-5 w-5" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className="toolbar-item p-1 rounded hover:bg-gray-200 disabled:opacity-50"
        aria-label="Redo"
      >
        <ArrowUturnRightIcon className="h-5 w-5" />
      </button>
      <Divider />

      {/* Text Formatting */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`toolbar-item spaced p-1 rounded hover:bg-gray-200 ${
          isBold ? "bg-gray-300" : ""
        }`}
        aria-label="Bold"
      >
        <span className="font-bold text-xl">B</span>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`toolbar-item spaced p-1 rounded hover:bg-gray-200 ${
          isItalic ? "bg-gray-300" : ""
        }`}
        aria-label="Italic"
      >
        <span className="italic text-xl">I</span>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={`toolbar-item spaced p-1 rounded hover:bg-gray-200 ${
          isUnderline ? "bg-gray-300" : ""
        }`}
        aria-label="Underline"
      >
        <span className="underline text-xl">U</span>
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        className={`toolbar-item spaced p-1 rounded hover:bg-gray-200 ${
          isStrikethrough ? "bg-gray-300" : ""
        }`}
        aria-label="Strikethrough"
      >
        <span className="line-through text-xl">S</span>
      </button>
      <Divider />

      {/* Element Formatting (Alignment) */}
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        className="toolbar-item spaced p-1 rounded hover:bg-gray-200"
        aria-label="Left Align"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        className="toolbar-item spaced p-1 rounded hover:bg-gray-200"
        aria-label="Center Align"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        className="toolbar-item spaced p-1 rounded hover:bg-gray-200"
        aria-label="Right Align"
      >
        <ArrowRightIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
        className="toolbar-item p-1 rounded hover:bg-gray-200"
        aria-label="Justify Align"
      >
        <Squares2X2Icon className="h-5 w-5" />
      </button>
      <Divider />

      {/* List Formatting */}
      <button
        onClick={() => toggleList(INSERT_UNORDERED_LIST_COMMAND)}
        className={`toolbar-item p-1 rounded hover:bg-gray-200 ${
          activeList === "ul" ? "bg-gray-300" : ""
        }`}
        aria-label="Bullet List"
      >
        <ListBulletIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => toggleList(INSERT_ORDERED_LIST_COMMAND)}
        className={`toolbar-item p-1 rounded hover:bg-gray-200 ${
          activeList === "ol" ? "bg-gray-300" : ""
        }`}
        aria-label="Ordered List"
      >
        <HashtagIcon className="h-5 w-5" />
      </button>
      <Divider />

      {/* Save & Load */}
      {/* <button
        onClick={handleSave}
        className="toolbar-item p-1 rounded hover:bg-gray-200"
        aria-label="Save"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
      <button
        onClick={handleLoad}
        className="toolbar-item p-1 rounded hover:bg-gray-200"
        aria-label="Load"
      >
        <FolderOpenIcon className="h-5 w-5" />
      </button> */}
    </div>
  );
}
