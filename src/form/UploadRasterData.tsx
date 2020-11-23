import React, { useState } from 'react';
import { useDropzone } from "react-dropzone";
import formStyles from "./../styles/Forms.module.css";
import uploadStyles from './UploadRasterData.module.css';
import buttonStyles from './../styles/Buttons.module.css';

import moment from "moment";
import "moment/locale/nl";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

interface MyProps {
  title: string,
  name: string,
  temporal: boolean,
}

interface AcceptedFile {
  file: File,
  dateTime: Date
}

interface RejectedFile {
  file: File,
  reason: string
}

export const UploadRasterData: React.FC<MyProps> = (props) => {
  const {
    title,
    name,
    temporal,
  } = props;

  const [acceptedFiles, setAcceptedFiles] = useState<AcceptedFile[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<RejectedFile[]>([]);

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
    const files = acceptedFiles.map(e => e.file);
    if (filesArrayContainsFile(files, file)) {
      return "File already selected";
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
    const oldAcceptedFiles = acceptedFiles.map(e => e.file);

    // ensure no duplicates in files by name and size
    const newAcceptedFilesNonDuplicates = files.filter(file => {
      return !filesArrayContainsFile(oldAcceptedFiles, file);
    });
    const duplicateFiles = files.filter(file => {
      return filesArrayContainsFile(oldAcceptedFiles, file);
    });

    const duplicateFilesPlusReason = duplicateFiles.map(file => {
      return {
        file: file,
        reason: getFileClientsideRejectionReason(file)
      };
    });

    // convert accepted files to Objects with Date
    const acceptedFilesData = newAcceptedFilesNonDuplicates.map(file => {
      const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/gm;
      const regexUTC = /\d{8}T(\d{4}|\d{6})?/gm;
      const dateStrFromFile = (file.name + "").match(regex);

      // If user upload a file with file name in UTC format without the dash (-) sign then match it with regexUTC
      const dateStrFromUTCFile = (file.name + "").match(regexUTC);
      // Use moment.js to re-format the date string from YYYYMMDDTHHMM to YYYY-MM-DDTHH:MM
      const dateStrReformatted = dateStrFromUTCFile && moment(dateStrFromUTCFile[0]).format("YYYY-MM-DDTHH:mm")

      let dateObjFromFile;
      if (dateStrFromFile) {
        dateObjFromFile = new Date(dateStrFromFile[0])
      } else if (dateStrReformatted) {
        dateObjFromFile = new Date(dateStrReformatted)
      } else {
        dateObjFromFile = new Date()
      };

      const fileDateValid = isValidDateObj(dateObjFromFile);
      return {
        file: file,
        dateTime: (fileDateValid && dateObjFromFile) || new Date()
      };
    });

    setRejectedFiles(rejectedFiles.concat(duplicateFilesPlusReason));
    setAcceptedFiles(acceptedFiles.concat(acceptedFilesData));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ["image/tiff", ".geotiff"] // accepted file types
  });

  const dropZone = (
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
  )

  const fileList = (
    <div
      className={uploadStyles.FileListContainer}
    >
      {rejectedFiles.map((e, i) => (
        <div
          key={e.file.name + e.file.size}
          className={uploadStyles.File}
          style={{ color: 'red' }}
        >
          <span
            className={uploadStyles.FileName}
          >
            {e.file.name}
          </span>
          <span>{e.reason}</span>
          <span
            className={uploadStyles.ClearIcon}
            onClick={() => {
              const rejectedFilesCopy = rejectedFiles;
              const newRejectedFiles = rejectedFilesCopy.filter(
                (_, iLoc) => i !== iLoc
              );
              setRejectedFiles(newRejectedFiles);
            }}
          >
            <i className={'material-icons'}>clear</i>
          </span>
        </div>
      ))}
      {temporal  ? (
        <div>
          {acceptedFiles.map((e, i) => (
            <div
              key={e.file.name + e.file.size}
              className={uploadStyles.File}
            >
              <span
                className={uploadStyles.FileName}
              >
                {e.file.name}
              </span>
              <span>
                <Datetime
                  value={e.dateTime}
                  onChange={event => {
                    let acceptedFilesCopy = acceptedFiles;
                    acceptedFilesCopy[i].dateTime = moment(event).toDate();
                    setAcceptedFiles(acceptedFilesCopy);
                  }}
                />
              </span>
              <span
                className={uploadStyles.ClearIcon}
                onClick={() => {
                  const acceptedFilesCopy = acceptedFiles;
                  const newAcceptedFiles = acceptedFilesCopy.filter(
                    (_, iLoc) => i !== iLoc
                  );
                  setAcceptedFiles(newAcceptedFiles);
                }}
              >
                <i className={'material-icons'}>clear</i>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {acceptedFiles.map((e, i) => (
            <div
              key={e.file.name + e.file.size}
              className={uploadStyles.File}
            >
              <span
                className={uploadStyles.FileName}
              >
                {e.file.name}
              </span>
              <span
                className={uploadStyles.ClearIcon}
                onClick={() => {
                  const acceptedFilesCopy = acceptedFiles;
                  const newAcceptedFiles = acceptedFilesCopy.filter(
                    (_, iLoc) => i !== iLoc
                  );
                  setAcceptedFiles(newAcceptedFiles);
                }}
              >
                <i className={'material-icons'}>clear</i>
              </span>
            </div>
          ))}
        </div>
      )}
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