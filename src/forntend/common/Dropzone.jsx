import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CiImageOn } from "react-icons/ci";

const Dropzone = ({
  onDrop,
  maxFiles = 5,
  maxSize = 2,
  multiple = true,
  label = "Click or drag image here",
  className = "",
  onDropReject,
}) => {
  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles?.length > 0) {
        onDrop(acceptedFiles);
      }
    },
    [onDrop]
  );

  const handleDropRejected = useCallback(
    (rejections) => {
      if (!onDropReject) return;

      rejections.forEach(({ errors }) => {
        const err = errors[0];

        if (err.code === "file-too-large") {
          onDropReject(`Image size must be less than ${maxSize} MB`);
        } else if (err.code === "too-many-files") {
          onDropReject(`Maximum ${maxFiles} images allowed`);
        } else {
          onDropReject(err.message);
        }
      });
    },
    [onDropReject, maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept: {
      "image/jpeg": [".jpeg", ".png" , ".webp"],
      "image/png": [],
      "image/svg+xml": [],
    },
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    multiple,
    noDrag: true,
  });

  return (
    <div
      {...getRootProps({
        className: `group dropzone border-2 border-dashed rounded-xl p-2  flex flex-col items-center justify-center 
      transition-all duration-200 cursor-pointer mx-auto
      ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }
      ${className}`,
      })}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center space-y-2">
        <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
          <CiImageOn size={22} className="text-gray-600" />
        </div>
        <p className="text-gray-700">{label || "Upload Image"}</p>
      </div>
    </div>
  );
};

export default Dropzone;
