import { storeDispatch } from "./../index";
import { addNotification, addTask } from "../actions";
import { uploadRasterSourceFile } from "../api/rasters";
import { AcceptedFile } from "../form/UploadRasterData";

export const sendDataToLizard = (uuid: string, data: AcceptedFile[], temporal: boolean) => {
  if (data.length === 0) {
    console.log('no data to send');
    return;
  };

  data.map(e => {
    return uploadRasterSourceFile(
      uuid,
      e.file,
      temporal ? e.dateTime : undefined
    )
      .then(response => {
        const status = response.status;
        if (status === 200) {
          return response.json();
        } else if (status === 400) {
          storeDispatch(addNotification(`Error uploading ${e.file.name}`, 5000));
        };
      })
      .then(response => {
        if (response) {
          storeDispatch(addTask(response.task_id, e.file.name, e.file.size));
        };
      })
      .catch(e => console.error(e));
  });
};