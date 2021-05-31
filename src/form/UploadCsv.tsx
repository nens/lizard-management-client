import React from 'react';
import { useDropzone } from "react-dropzone";
import formStyles from "./../styles/Forms.module.css";
import uploadStyles from './UploadRasterData.module.css';
import buttonStyles from './../styles/Buttons.module.css';

interface MyProps {
  title: string,
  name: string,
  data: File[],
  setData: (data: File[]) => void,
  onFocus?: (e: any) => void,
  onBlur?: () => void,
}

export const UploadCsv = (props: MyProps) => {
  const {
    title,
    name,
    data,
    setData,
    onFocus,
  } = props;

  const filesArrayContainsFile = (files: File[], file: File) => {
    return files.some(oneFile => filesAreEqual(oneFile, file));
  };

  const filesAreEqual = (a: File, b: File) => {
    return a.name === b.name && a.size === b.size;
  };

  const onDrop = (files: File[]) => {
    // ensure no duplicates in files by name and size
    const newFilesNonDuplicates = files.filter(file => {
      return !filesArrayContainsFile(data, file);
    });
    setData(data.concat(newFilesNonDuplicates));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [".csv"]
  });

  const dropZone = (
    <div
      id={name}
      className={uploadStyles.DropZoneContainer}
      {...getRootProps()}
      onFocus={onFocus}
    >
      <input
        {...getInputProps()}
      />
      {isDragActive ? (
        <span>Drop selected files here ...</span>
      ) : (
        <span>Drag and drop .csv files here or
          <span
            className={buttonStyles.NewButton}
            style={{ marginLeft: 10}}
          >
            BROWSE
          </span>
        </span>
      )}
    </div>
  )

  const fileList = (
    <div
      className={uploadStyles.FileListContainer}
    >
      {data.map((e, i) => (
        <div
          key={e.name + e.size}
          className={uploadStyles.File}
        >
          <span
            className={uploadStyles.FileName}
          >
            {e.name}
          </span>
          <span
            className={uploadStyles.ClearIcon}
            onClick={() => {
              const dataCopy = data;
              const newData = dataCopy.filter(
                (_, iLoc) => i !== iLoc
              );
              setData(newData);
            }}
          >
            <i className={'material-icons'}>clear</i>
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      {dropZone}
      {fileList}
    </label>
  )
};