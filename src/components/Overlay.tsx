import { useEffect } from "react";
import CSSTransition from "react-transition-group/CSSTransition";
import styles from ".//ErrorOverlay.module.css";

interface Props {
  confirmModal: boolean,
  handleClose: () => void
}

const Overlay: React.FC<Props> = (props) => {
  // Close the overlay
  const hideErrorOverlay = (e: KeyboardEvent) => {
    if (e.key === "Escape") props.handleClose();
  };

  useEffect(() => {
    document.addEventListener("keydown", hideErrorOverlay, false);
    return () => document.removeEventListener("keydown", hideErrorOverlay, false);
  });

  return (
    <div className={styles.ErrorOverlayContainer}>
      <CSSTransition
        in={true}
        appear={true}
        timeout={500}
        classNames={{
          enter: styles.Enter,
          enterActive: styles.EnterActive,
          exit: styles.Leave,
          exitActive: styles.LeaveActive,
          appear: styles.Appear,
          appearActive: styles.AppearActive
        }}
      >
        <div
          className={props.confirmModal ? styles.ConfirmOverlay : styles.ErrorOverlay}
        >
          {props.children}
        </div>
      </CSSTransition>
    </div>
  );
}

export default Overlay;