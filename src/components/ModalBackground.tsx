import React, { useEffect } from 'react';
import styles from './ModalBackground.module.css';

interface MyProps {
  title: string,
  handleClose: () => void,
  height?: string,
  width?: string,
}

const ModalBackground: React.FC<MyProps> = (props) => {
  // Add event listener to close modal on 'ESCAPE'
  useEffect(() => {
    const closeModalOnEsc = (e: any) => {
      if (e.key === 'Escape') props.handleClose();
    };
    window.addEventListener('keydown', closeModalOnEsc);
    return () => window.removeEventListener('keydown', closeModalOnEsc);
  });

  return (
    <div className={styles.ModalBackground}>
      <div
        className={styles.ModalBox}
        style={{
          height: props.height,
          width: props.width
        }}
      >
        <div className={styles.ModalTitle}>
          <span>{props.title}</span>
          <span
            className={styles.CloseButton}
            onClick={() => props.handleClose()}
          >
            <i className="material-icons">close</i>
          </span>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default ModalBackground;