import CSSTransition from "react-transition-group/CSSTransition";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import styles from "../../components/OrganisationSwitcher.css";
import Lottie from "react-lottie";
import * as animationData from "./success.json";

// Based on the OrganisationSwitcher, this overlay gets called when an error occurs during the upload process.
class ErrorOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      errorMessage: this.props.errorMessage,
      isStopped: false,
      isPaused: false
    };
    this.handleResize = this.handleResize.bind(this);
    this.hideOrganisationSwitcher = this.hideOrganisationSwitcher.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.hideOrganisationSwitcher, false);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener(
      "keydown",
      this.hideOrganisationSwitcher,
      false
    );
  }
  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  hideOrganisationSwitcher(e) {
    if (e.key === "Escape") {
      this.props.handleClose();
    }
  }

  render() {
    const buttonStyle = {
      display: "block",
      margin: "10px auto"
    };

    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

    const { handleClose, isFetching, errorMessage } = this.props;

    return (
      <div className={styles.OrganisationSwitcherContainer}>
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
          <div className={styles.OrganisationSwitcher}>
            <div className={styles.CloseButton} onClick={handleClose}>
              <i className="material-icons">close</i>
            </div>
            {this.props.isFetching ? (
              <div>
                <h1>{errorMessage}</h1>
                <h1 className={styles.SuccesText}>
                  {" "}
                  Succes! Your raster meta-data was uploaded succesfully
                </h1>
                <Lottie
                  options={defaultOptions}
                  height={400}
                  width={400}
                  isStopped={this.state.isStopped}
                  isPaused={this.state.isPaused}
                />
              </div>
            ) : (
              <h1>Loading</h1>
            )}
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default ErrorOverlay;
