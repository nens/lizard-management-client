import React, { useState } from 'react';
import { useDropzone } from "react-dropzone";
import formStyles from "./../styles/Forms.module.css";
import uploadStyles from './UploadRasterData.module.css';
import buttonStyles from './../styles/Buttons.module.css';

interface MyProps {
  title: string,
  name: string,
}

export const UploadRasterData: React.FC<MyProps> = (props) => {
  const {
    title,
    name,
  } = props;

  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  console.log('acceptedFiles', acceptedFiles);

  // check for valid date
  // https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  const isValidDateObj = (d: Date) => {
    if (Object.prototype.toString.call(d) === "[object Date]") {
      // it is a date
      if (isNaN(d.getTime())) {
        // d.valueOf() could also work
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const filesArrayContainsFile = (files: File[], file: File) => {
    return files.some(oneFile => filesAreEqual(oneFile, file));
  };

  const filesAreEqual = (a: File, b: File) => {
    return a.name === b.name && a.size === b.size;
  };

  const getFileClientsideRejectionReason = (file: File) => {
    if (filesArrayContainsFile(acceptedFiles, file)) {
      return "A file with this name and size was already selected";
    } else if (
      !file.name.toLowerCase().endsWith(".tif") ||
      !file.name.toLowerCase().endsWith(".tiff") ||
      !file.name.toLowerCase().endsWith(".geotiff")
    ) {
      return "Only .tif .tiff or .geotiff files are valid";
    } else {
      return "Reason not known";
    };
  };

  const onDrop = (files: File[]) => {
    console.log('files', files);
    setAcceptedFiles(acceptedFiles.concat(files))
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ["image/tiff", ".geotiff"] // accepted file types
  });

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div
        className={uploadStyles.DropZoneContainer}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <span>Drop selected files here ...</span>
        ) : (
          <span>Drag and drop .tiff files here or
            <span
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              style={{ marginLeft: 10}}
            >
              BROWSE
            </span>
          </span>
        )}
      </div>
    </label>
  )
};