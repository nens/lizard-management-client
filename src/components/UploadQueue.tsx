import React from 'react';
import { connect } from 'react-redux';
import { useSelector } from 'react-redux';
import { getUploadFiles } from '../reducers';
import { bytesToMb } from '../utils/byteUtils';
import ModalBackground from './ModalBackground';
import styles from './UploadQueue.module.css';
import buttonStyles from './../styles/Buttons.module.css';

import timer from "../images/timer.svg";
import setting from "../images/setting.svg";
import checkMark from "../images/checkMark.svg";
import upload from "../images/upload.svg";
import warning from "../images/warning.svg";
import { removeFileFromQueue } from '../actions';

const getStatusIcon = (status: string) => {
  if (status === 'WAITING') {
    return timer;
  } else if (status === 'UPLOADING') {
    return upload;
  } else if (status === 'PROCESSING') {
    return setting;
  } else if (status === 'SUCCESS') {
    return checkMark;
  } else if (status === 'FAILED') {
    return warning;
  };
}

const getStatusColor = (status: string) => {
  if (status === 'WAITING') {
    return '#A4ABB3';
  } else if (status === 'UPLOADING' || status === 'PROCESSING') {
    return '#003D7A';
  } else if (status === 'SUCCESS') {
    return '#139696';
  } else if (status === 'FAILED') {
    return '#B40202';
  };
}

interface MyProps {
  handleClose: () => void,
}
interface PropsFromDispatch {
  removeFileFromQueue: (file: File) => void,
};

const UploadQueue: React.FC<MyProps & PropsFromDispatch> = (props) => {
  const uploadFiles: any[] = useSelector(getUploadFiles);

  return (
    <ModalBackground
      title={'Upload Queue'}
      handleClose={() => props.handleClose()}
      height={'600px'}
    >
      <div className={styles.ModalBody}>
        <div className={`${styles.GridContainer} ${styles.GridContainerHeader}`}>
          <div className={styles.GridItem}>Filename</div>
          <div className={styles.GridItem}>Filesize</div>
          <div className={styles.GridItem}>Status</div>
          <div className={styles.GridItem}/>
          <div className={styles.GridItem}/>
        </div>
        {uploadFiles && uploadFiles.length > 0 ? (
          <div className={`${styles.GridContainer} ${styles.GridContainerBody}`}>
            {uploadFiles.map(file => (
              <React.Fragment key={file.name + file.size}>
                <div className={styles.GridItem}>{file.name}</div>
                <div className={styles.GridItem}>{bytesToMb(file.size)}</div>
                <div
                  className={styles.GridItem}
                  style={{
                    color: getStatusColor(file.status)
                  }}
                >
                  {file.status}
                </div>
                <div className={`${styles.GridItem} ${styles.Image}`}>
                  <img src={getStatusIcon(file.status)} alt={file.status} />
                </div>
                {file.status === 'SUCCESS' || file.status === 'FAILED' ? (
                  <div
                    className={`${styles.GridItem} ${styles.RemoveIcon}`}
                    onClick={() => props.removeFileFromQueue(file)}
                  >
                    <i className="material-icons">close</i>
                  </div>
                ) : (
                  <div className={styles.GridItem} />
                )}
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.ModalFooter}>
        <button
          className={buttonStyles.NewButton}
          onClick={() => {
            if (uploadFiles && uploadFiles.length > 0) {
              const finishedFiles = uploadFiles.filter(file => file.status === 'SUCCESS' || file.status === 'FAILED');
              return finishedFiles.map(file => props.removeFileFromQueue(file));
            };
          }}
          disabled={!uploadFiles || uploadFiles.length === 0}
        >
          Clean queue
        </button>
      </div>
    </ModalBackground>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  removeFileFromQueue: (file: File) => dispatch(removeFileFromQueue(file)),
});

export default connect(null, mapDispatchToProps)(UploadQueue);