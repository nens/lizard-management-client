import React from 'react';
import { useDropzone } from "react-dropzone";
import formStyles from "./../styles/Forms.module.css";
import uploadStyles from './UploadData.module.css';
import buttonStyles from './../styles/Buttons.module.css';

import moment from "moment";
import "moment/locale/nl";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

export interface AcceptedFile {
  file: File,
  dateTime: Date | undefined,
}

interface MyProps {
  title: string,
  name: string,
  temporal: boolean,
  fileTypes: string[], // array of accepted file types e.g. .tiff .csv
  data: AcceptedFile[],
  setData: (data: AcceptedFile[]) => void,
  onFocus?: (e: any) => void,
  onBlur?: () => void,
}

export const UploadData: React.FC<MyProps> = (props) => {
  const {
    title,
    name,
    temporal,
    fileTypes,
    data,
    setData,
    onFocus,
  } = props;

  // check for valid date
  // https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  const isValidDateObj = (d: Date | undefined) => {
    if (d && Object.prototype.toString.call(d) === "[object Date]") {
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
      // Look for the timezone information part from the filename
      const timezoneRegex = /[+-]((\d{2}:\d{2})|(\d{4}))/;
      const timezoneFromFile = file.name.match(timezoneRegex);

      // If user uploads a file in the standard ISO 8601 format e.g. 2015-10-29T10:11:40
      const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/;
      const dateStrFromFile = file.name.match(regex);

      // If user upload a file without the dash (-) sign e.g. 20151029T101140
      const regexUTC = /\d{8}T(\d{6}|\d{4})?/;
      const dateStrFromUTCFile = file.name.match(regexUTC);

      // If user uploads a file in YYYY-MM-DDTHHmmss which is valid for the FTP import e.g. 2015-10-29T101140
      const regexUTCNonISO8601 = /\d{4}-\d{2}-\d{2}T(\d{6}|\d{4})?/;
      const dateStrFromUTCNonISO8601 = file.name.match(regexUTCNonISO8601);
      // Remove all dashes (-) from dateStrFromUTCNonISO8601 to convert it to YYYYMMDDTHHMM
      const dateStrFromUTCNonISO8601WithoutDash = dateStrFromUTCNonISO8601 ? dateStrFromUTCNonISO8601[0].replaceAll('-', '') : null;

      // Use moment.js to re-format the date string from YYYYMMDDTHHMM to YYYY-MM-DDTHH:MM
      const dateStrReformatted = (
        dateStrFromFile ? dateStrFromFile[0] :
        dateStrFromUTCFile ? moment(dateStrFromUTCFile[0]).format("YYYY-MM-DDTHH:mm:ss") :
        dateStrFromUTCNonISO8601 && dateStrFromUTCNonISO8601WithoutDash ? moment(dateStrFromUTCNonISO8601WithoutDash).format("YYYY-MM-DDTHH:mm:ss") :
        null
      );

      // Add timezone information or Z (UTC time) to the end of the date string
      const dateStrReformattedInUTC = dateStrReformatted && (dateStrReformatted + (timezoneFromFile ? timezoneFromFile[0] : 'Z'));

      // Convert to Date object
      const dateObjFromFile: Date | undefined = dateStrReformattedInUTC ? new Date(dateStrReformattedInUTC) : undefined;

      const fileDateValid = isValidDateObj(dateObjFromFile);
      return {
        file: file,
        dateTime: (fileDateValid && dateObjFromFile) || undefined
      };
    });

    return setData(data.concat(filesData));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes // accepted file types
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
        <span>Drag and drop {fileTypes.includes('.csv') ? '.csv' : '.tif'} files here or
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
              <span
                className={uploadStyles.DateTimeContainer}
              >
                <Datetime
                  value={e.dateTime}
                  onChange={event => {
                    let dataCopy = data;
                    dataCopy[i].dateTime = moment(event).toDate();
                    setData(dataCopy);
                  }}
                  inputProps={{
                    className: `${formStyles.FormControl} ${formStyles.FormSubmitted}`,
                    // Validations for the date time input field
                    // 1. it cannot be left empty
                    // 2. Invalid Date is not validated
                    required: true,
                    pattern: "[^Invalid]+",
                  }}
                  timeFormat={"HH:mm:ss"}
                  utc
                />
                <span style={{ marginLeft: 10 }}><em>(UTC)</em></span>
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
              <span />
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