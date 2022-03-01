import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { AppDispatch } from "..";
import { getFinsihedFiles, getUploadFiles, getFilesInProcess, FileState } from "../reducers";
import { removeFileFromQueue } from "../actions";
import { bytesToMb } from "../utils/byteUtils";
import ModalBackground from "./ModalBackground";
import styles from "./UploadQueue.module.css";
import buttonStyles from "./../styles/Buttons.module.css";

import timer from "../images/timer.svg";
import setting from "../images/setting.svg";
import checkMark from "../images/checkMark.svg";
import upload from "../images/upload.svg";
import warning from "../images/warning.svg";

const getStatusIcon = (status: string) => {
  if (status === "WAITING") {
    return timer;
  } else if (status === "UPLOADING") {
    return upload;
  } else if (status === "PROCESSING") {
    return setting;
  } else if (status === "SUCCESS") {
    return checkMark;
  } else if (status === "FAILED") {
    return warning;
  }
};

const getStatusColor = (status: string) => {
  if (status === "WAITING") {
    return "#A4ABB3";
  } else if (status === "UPLOADING" || status === "PROCESSING") {
    return "#003D7A";
  } else if (status === "SUCCESS") {
    return "#139696";
  } else if (status === "FAILED") {
    return "#B40202";
  }
};

interface MyProps {
  handleClose: () => void;
}
interface PropsFromDispatch {
  removeFileFromQueue: (file: File) => void;
}

const UploadQueue: React.FC<MyProps & PropsFromDispatch> = (props) => {
  const uploadFiles: FileState[] = useSelector(getUploadFiles);
  const finishedFiles: FileState[] = useSelector(getFinsihedFiles);

  const waitingOrUploadingFiles = (uploadFiles || []).filter(
    (file) => file.status === "WAITING" || file.status === "UPLOADING"
  );
  const mustWaitForFiles = waitingOrUploadingFiles.length !== 0;

  const filesInProcess = useSelector(getFilesInProcess);
  const hasFilesInProcess = (filesInProcess || []).length !== 0;

  useEffect(() => {
    window.onbeforeunload = function () {};
    if (mustWaitForFiles) {
      window.onbeforeunload = function (event: BeforeUnloadEvent) {
        event.preventDefault();
        return (event.returnValue = "");
      };
    }
  }, [mustWaitForFiles]);

  return (
    <ModalBackground
      title={mustWaitForFiles ? "Do not close! Upload Queue Busy" : "Upload Queue"}
      handleClose={mustWaitForFiles ? undefined : () => props.handleClose()}
      style={{
        height: 600,
      }}
    >
      <div className={styles.ModalBody}>
        {mustWaitForFiles ? (
          <span>
            The upload queue is currently busy uploading files. <br />
            Do not close your browser-tab untill this text disappears. <br />
            Closing this tab means the uploads will abort!
          </span>
        ) : hasFilesInProcess ? (
          <span>
            The upload queue is finished uploading, but the backend is still busy. <br />
            If you want to keep track of the progress of your files then keep this browser-tab open.{" "}
            <br />
            Closing the this browser-tab will not abort the files, but you will no longer be able to
            follow the progress.
          </span>
        ) : null}

        <div className={`${styles.GridContainer} ${styles.GridContainerHeader}`}>
          <div className={styles.GridItem}>Filename</div>
          <div className={styles.GridItem}>Filesize</div>
          <div className={styles.GridItem}>Status</div>
          <div className={styles.GridItem} />
          {/* <div className={styles.GridItem}/> */}
        </div>
        {(uploadFiles || []).length === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "24px",
            }}
          >
            <span>No files currently uploading</span>
          </div>
        ) : null}
        {uploadFiles && uploadFiles.length > 0 ? (
          <div className={`${styles.GridContainer} ${styles.GridContainerBody}`}>
            {uploadFiles.map((file) => (
              <React.Fragment key={file.name + file.size}>
                <div className={styles.GridItem}>{file.name}</div>
                <div className={styles.GridItem}>{bytesToMb(file.size)}</div>
                <div
                  className={styles.GridItem}
                  style={{
                    color: getStatusColor(file.status),
                  }}
                >
                  {file.status}
                </div>
                <div className={`${styles.GridItem} ${styles.Image}`}>
                  <img src={getStatusIcon(file.status)} alt={file.status} />
                </div>
                {/* {file.status === 'SUCCESS' || file.status === 'FAILED' ? (
                  <div
                    className={`${styles.GridItem} ${styles.RemoveIcon}`}
                    onClick={() => props.removeFileFromQueue(file)}
                  >
                    <i className="material-icons">close</i>
                  </div>
                ) : (
                  <div className={styles.GridItem} />
                )} */}
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.ModalFooter}>
        <button
          className={buttonStyles.LinkCancel}
          onClick={() => !mustWaitForFiles && props.handleClose()}
          disabled={mustWaitForFiles}
          title={"Close this modal"}
        >
          CLOSE
        </button>
        <button
          className={buttonStyles.NewButton}
          onClick={() => finishedFiles.map((file) => props.removeFileFromQueue(file))}
          disabled={!finishedFiles || finishedFiles.length === 0}
        >
          Clear finished tasks
        </button>
      </div>
    </ModalBackground>
  );
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  removeFileFromQueue: (file: File) => dispatch(removeFileFromQueue(file)),
});

export default connect(null, mapDispatchToProps)(UploadQueue);
