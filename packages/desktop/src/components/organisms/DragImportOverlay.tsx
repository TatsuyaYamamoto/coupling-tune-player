/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React, { FC, forwardRef, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DragImportOverlayProps {
  onFileDropped: (files: FileList) => void;
}

const DragImportOverlay: FC<DragImportOverlayProps> = (props) => {
  const { onFileDropped } = props;

  const dragEventCounter = useRef(0);
  const [show, handleShow] = useState(false);
  const zIndex = 1000;

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragEnter = (e: DragEvent) => {
      console.log(e.type, e.target, e?.dataTransfer?.files);

      const prevCount = dragEventCounter.current;
      dragEventCounter.current += 1;
      if (prevCount === 0) {
        handleShow(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      console.log(e.type, e.target, e?.dataTransfer?.files);
      const prevCount = dragEventCounter.current;
      dragEventCounter.current -= 1;

      if (prevCount === 1) {
        handleShow(false);
      }
    };
    const handleDrop = (e: DragEvent) => {
      dragEventCounter.current = 0;
      handleShow(false);

      const files = e?.dataTransfer?.files;
      if (files) {
        onFileDropped(files);
      }
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  const children = (
    <div
      css={css`
        z-index: ${zIndex};

        position: absolute;
        top: 0;
        bottom: 0;

        width: 100vw;
        height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        css={css`
          z-index: ${zIndex - 1};
          pointer-events: none;

          display: flex;
          justify-content: center;
          align-items: center;

          width: 90vw;
          height: 90vh;
          background-color: rgba(255, 165, 0, 0.3);
          border: solid 5px rgba(255, 165, 0, 1);
          border-radius: 10px;
        `}
      >
        <span
          css={css`
            font-size: 20px;
            padding: 50px;
          `}
        >
          {`ここに曲やフォルダをドラッグするとライブラリに音楽を追加できます。`}
        </span>
      </div>
    </div>
  );

  return show ? (createPortal(children, document.body) as any) : null;
};

export default DragImportOverlay;
