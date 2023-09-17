import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function MyDropzone({ onChange, text }) {
  const onDrop = useCallback((acceptedFiles) => {
    onChange(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-black p-3 h-16 w-full rounded-md border-dashed text-black cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>
          {text || "Drag 'n' drop some files here, or click to select files"}
        </p>
      )}
    </div>
  );
}
