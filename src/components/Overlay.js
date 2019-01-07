import CSSTransition from "react-transition-group/CSSTransition";
import React, { Component } from "react";
import styles from ".//ErrorOverlay.css";

class Overlay extends Component {
  componentDidMount() {
    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.hideErrorOverlay, false);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener("keydown", this.hideErrorOverlay, false);
  }

  // Resize the overlay
  handleResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  // Close the overlay
  hideErrorOverlay = e => {
    if (e.key === "Escape") {
      this.props.handleClose();
    }
  };

  render() {
    return (
      <div className={styles.ErrorOverlayContainer}>
        <CSSTransition
          in={true}
          appear={true}
          timeout={500}
          classNames={{
            enter: styles.Enter,
            enterActive: styles.EnterActive,
            leave: styles.Leave,
            leaveActive: styles.LeaveActive,
            appear: styles.Appear,
            appearActive: styles.AppearActive
          }}
        >
          <div className={styles.ErrorOverlay}>{this.props.children}</div>
        </CSSTransition>
      </div>
    );
  }
}

export default Overlay;
