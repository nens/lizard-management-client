import React from 'react';
import { useDropzone } from "react-dropzone";
import formStyles from "./../styles/Forms.module.css";
import uploadStyles from './UploadRasterData.module.css';
import buttonStyles from './../styles/Buttons.module.css';

import moment from "moment";
import "moment/locale/nl";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

export interface AcceptedFile {
  file: File,
  dateTime: Date
}

interface MyProps {
  title: string,
  name: string,
  temporal: boolean,
  data: AcceptedFile[],
  setData: (data: AcceptedFile[]) => void,
  onFocus?: (e: any) => void,
  onBlur?: () => void,
}

export const UploadRasterData: React.FC<MyProps> = (props) => {
  const {
    title,
    name,
    temporal,
    data,
    setData,
    onFocus,
    onBlur,
  } = props;

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

  const onDrop = (files: File[]) => {
    const oldFiles = data.map(e => e.file);

    // ensure no duplicates in files by name and size
    const newFilesNonDuplicates = files.filter(file => {
      return !filesArrayContainsFile(oldFiles, file);
    });

    // convert files to Objects with Date
    const filesData = newFilesNonDuplicates.map(file => {
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

    setData(data.concat(filesData));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ["image/tiff", ".geotiff"] // accepted file types
  });

  const dropZone = (
    <div
      id={name}
      className={uploadStyles.DropZoneContainer}
      {...getRootProps()}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <input
        {...getInputProps()}
      />
      {isDragActive ? (
        <span>Drop selected files here ...</span>
      ) : (
        <span>Drag and drop .tiff files here or
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
      {temporal  ? (
        <div>
          {data.map((e, i) => (
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
                    let dataCopy = data;
                    dataCopy[i].dateTime = moment(event).toDate();
                    setData(dataCopy);
                  }}
                />
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
      ) : (
        <div>
          {data.map((e, i) => (
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