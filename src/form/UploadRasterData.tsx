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

  const [acceptedFiles, setAcceptedFiles] = useState<any[]>([]);
  console.log('acceptedFiles', acceptedFiles);

  const onDrop = (files: any) => {
    console.log('files', files);
    setAcceptedFiles(acceptedFiles.concat(files))
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

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