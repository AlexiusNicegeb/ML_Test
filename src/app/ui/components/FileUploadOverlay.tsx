import { createPortal } from "react-dom";

export interface UploadFile {
  id: string;
  name: string;
}

export interface UploadFileProgress {
  id: string;
  progress: number;
}

interface FileUploadOverlayProps {
  isUploading: boolean;
  filesToUpload: UploadFile[];
  uploadFilesProgress: UploadFileProgress[];
}
export const FileUploadOverlay = ({
  isUploading,
  filesToUpload,
  uploadFilesProgress,
}: FileUploadOverlayProps) => {
  return (
    <>
      {isUploading &&
        createPortal(
          <div className="files-update-overlay">
            <h2>Dateien werden hochgeladen...</h2>
            <ul>
              {filesToUpload.map((file) => (
                <li className="flex flex-col gap-2" key={file.id}>
                  <div>{file.name}</div>

                  <div className="progress-bar">
                    <span
                      style={{
                        height: "100%",
                        width:
                          uploadFilesProgress.findLast((u) => u.id === file.id)
                            ?.progress + "%",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
};
