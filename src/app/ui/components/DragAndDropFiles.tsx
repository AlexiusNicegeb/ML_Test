import { findFileById, findFileByPath } from "@/app/helpers";
import { FolderData } from "@/app/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Button } from "./Button";

interface DragAndDropProps {
  folder: FolderData;
  droppedItems: {
    videos: DroppedItems;
    files: DroppedItems;
  };
  onChange?: ({
    items,
    videoOrFiles,
  }: {
    items: DroppedItems;
    videoOrFiles: "videos" | "files";
  }) => void;
}

export type DroppedItems = {
  value: string;
}[];

export interface DragItem {
  id: string;
  label: string;
  value: string;
}

interface DraggableListProps {
  id: UniqueIdentifier;
  folder: FolderData;
}

interface DroppableListProps {
  id: UniqueIdentifier;
  droppedFiles: DragItem[];
  onDelete: (file: DragItem) => void;
}

interface DraggableItemProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
}

function DraggableItem({ id, children }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    //visibility: transform ? ("hidden" as any) : ("visible" as any),
  };

  return (
    <div
      ref={setNodeRef}
      className="admin-draggable-item"
      style={style}
      {...listeners}
      {...attributes}
    >
      <MdDragIndicator size="20" className="mr-2" />
      {children}
    </div>
  );
}

const renderFolder = (folder: FolderData) => {
  return (
    <div className="folder-item">
      <h3>{folder.name}</h3>
      {folder.files.map((f) => (
        <DraggableItem key={f.id} id={f.id}>
          {f.name}
        </DraggableItem>
      ))}
      {folder.subfolders.map((f) => {
        return <Fragment key={f.id}>{renderFolder(f)}</Fragment>;
      })}
    </div>
  );
};

function DraggableList({ id, folder }: DraggableListProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="dragable-list">
      {renderFolder(folder)}
    </div>
  );
}

function DroppableList({ id, droppedFiles, onDelete }: DroppableListProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="droppable-list">
      {droppedFiles.map((f) => (
        <div className="flex items-center gap-4 px-4 py-2" key={f.id}>
          {f.label}
          <Button
            className="!p-2 ml-auto"
            onClick={() => {
              onDelete(f);
            }}
          >
            <RiDeleteBinLine size={20} />
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function DragAndDropFiles({
  folder,
  onChange,
  droppedItems,
}: DragAndDropProps) {
  const [hoveredId, setHoveredId] = useState("");
  const [droppedVideos, setDroppedVideos] = useState<DragItem[]>([]);
  const [droppedFiles, setDroppedFiles] = useState<DragItem[]>([]);
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);

  useEffect(() => {
    const droppedVideosShadow: DragItem[] = [];
    const droppedFilesShadow: DragItem[] = [];
    droppedItems.videos.forEach((v) => {
      const file = findFileByPath(folder, v.value);
      if (file) {
        droppedVideosShadow.push({
          id: file.id,
          label: file.name,
          value: file.path,
        });
        setDroppedVideos(droppedVideosShadow);
      }
    });

    droppedItems.files.forEach((v) => {
      const file = findFileByPath(folder, v.value);
      if (file) {
        droppedFilesShadow.push({
          id: file.id,
          label: file.name,
          value: file.path,
        });
        setDroppedFiles(droppedFilesShadow);
      }
    });
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const activeFile = findFileById(folder, event.active.id.toString());
    if (activeFile) {
      setActiveItem({
        id: activeFile.id,
        label: activeFile.name,
        value: activeFile.path,
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    setHoveredId(event.over?.id.toString() || "");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setHoveredId("");

    if (over) {
      // Drag to right
      if (
        over.id.toString() === "list2" &&
        !droppedVideos.find((d) => d.id === active.id.toString())
      ) {
        if (activeItem && !droppedVideos.find((d) => d.id === activeItem.id)) {
          const updatedVideos = [...droppedVideos, { ...activeItem }];
          setDroppedVideos(updatedVideos);
          onChange?.({
            items: updatedVideos.map((v) => ({ value: v.value })),
            videoOrFiles: "videos",
          });
        }
      }

      if (
        over.id.toString() === "list3" &&
        !droppedFiles.find((d) => d.id === active.id.toString())
      ) {
        if (activeItem && !droppedFiles.find((d) => d.id === activeItem.id)) {
          const updatedFiles = [...droppedFiles, { ...activeItem }];
          setDroppedFiles(updatedFiles);
          onChange?.({
            items: updatedFiles.map((f) => ({ value: f.value })),
            videoOrFiles: "files",
          });
        }
      }
    }

    setActiveItem(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="admin-drag-and-drop">
        <div>
          <h3 className="mb-4">Alle Dateien</h3>
          <DraggableList id="list1" folder={folder} />
        </div>
        <div>
          <h3 className="mb-4">Ausgewählte Videos</h3>
          <div
            className={clsx(
              "drop-container",
              hoveredId === "list2" && "hovered"
            )}
          >
            <DroppableList
              id="list2"
              droppedFiles={droppedVideos}
              onDelete={(f) => {
                const updatedVideos = droppedVideos.filter(
                  (d) => d.id !== f.id
                );
                setDroppedVideos(updatedVideos);
                onChange?.({
                  items: updatedVideos,
                  videoOrFiles: "videos",
                });
              }}
            />
          </div>
          <h3 className="mb-4">Ausgewählte Dateien</h3>
          <div
            className={clsx(
              "drop-container",
              hoveredId === "list3" && "hovered"
            )}
          >
            <DroppableList
              id="list3"
              droppedFiles={droppedFiles}
              onDelete={(f) => {
                const updatedFiles = droppedFiles.filter((d) => d.id !== f.id);
                setDroppedFiles(updatedFiles);
                onChange?.({
                  items: updatedFiles,
                  videoOrFiles: "files",
                });
              }}
            />
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="admin-draggable-item">
            <MdDragIndicator size="20" className="mr-2" />
            {activeItem.label}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
