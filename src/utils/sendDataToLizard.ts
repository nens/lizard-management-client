import { appDispatch } from "./../index";
import { addNotification, addTaskUuidToFile, updateFileStatus } from "../actions";
import { uploadRasterSourceFile } from "../api/rasters";
import { AcceptedFile } from "../form/UploadData";

export const sendDataToLizardRecursive = (
  uuid: string,
  data: AcceptedFile[],
  temporal: boolean
) => {
  // make a copy of the original array
  const copyOfData = data;

  // end recursion if empty array
  if (copyOfData.length === 0) {
    console.log("sendDataToLizard stop recursion");
    return;
  }

  // send data to lizard server recursively
  const e = copyOfData.shift();

  // skip the file if file cannot be found
  if (!e) {
    console.log("sendDataToLizard skip file", e);
    return;
  }

  // else proceed sending the file to Lizard server
  appDispatch(updateFileStatus(e.file, "UPLOADING"));
  uploadRasterSourceFile(uuid, e.file, temporal ? e.dateTime : undefined)
    .then((response) => {
      const status = response.status;

      // continue with next file
      sendDataToLizardRecursive(uuid, copyOfData, temporal);

      // return
      if (status === 200) {
        appDispatch(updateFileStatus(e.file, "PROCESSING"));
        return response.json();
      } else if (status === 400) {
        appDispatch(updateFileStatus(e.file, "FAILED"));
        appDispatch(addNotification(`Error uploading ${e.file.name}`, 5000));
        return;
      } else if (status === 504) {
        // Gateway Timeout
        appDispatch(updateFileStatus(e.file, "FAILED"));
        appDispatch(
          addNotification(
            `Gateway Timeout in uploading ${e.file.name}. File is too big, please split into smaller files.`,
            5000
          )
        );
      } else {
        appDispatch(updateFileStatus(e.file, "FAILED"));
        appDispatch(addNotification(`Error uploading ${e.file.name}`, 5000));
      }
    })
    .then((response) => {
      if (response) {
        appDispatch(addTaskUuidToFile(e.file, response.task_id));
      }
    })
    .catch((e) => console.error(e));

  return;
};
