import CSSTransition from "react-transition-group/CSSTransition";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import styles from "../../components/ErrorOverlay.css";
import Lottie from "react-lottie";
import * as animationSucces from "./success.json";
import * as animationError from "./error.json";
import buttonStyles from "../../styles/Buttons.css";
import { FormattedMessage } from "react-intl";

// Based on the OrganisationSwitcher, this overlay gets called when an error occurs during the upload process.
class ErrorOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      isStopped: false,
      isPaused: false
    };
    this.handleResize = this.handleResize.bind(this);
    this.hideOrganisationSwitcher = this.hideOrganisationSwitcher.bind(this);
    this.whichAnimation = this.whichAnimation.bind(this);
    this.whichMessage = this.whichMessage.bind(this);
    this.succesButtons = this.succesButtons.bind(this);
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

  whichAnimation() {
    var animationData;
    if (
      this.props.errorMessage.status === 201 ||
      this.props.errorMessage.status === 200
    ) {
      animationData = animationSucces;
    } else {
      animationData = animationError;
    }
    return animationData;
  }

  succesButtons() {
    if (
      this.props.errorMessage.status === 201 ||
      this.props.errorMessage.status === 200
    ) {
      console.log(window.pageYOffset);
      return true;
    } else {
      return false;
    }
  }

  whichMessage() {
    if (
      this.props.errorMessage.status === 201 ||
      this.props.errorMessage.status === 200
    ) {
      return "Succes! Your raster meta-data was uploaded succesfully. You can add your data now, or do it later";
    } else if (this.props.errorMessage.status.toString().startsWith(4)) {
      return (
        "Oops, something went wrong. Please check the form and your internet settings. Error code is: " +
        JSON.stringify(this.props.errorMessage.status) +
        JSON.stringify(this.props.errorMessage.statusText)
      );
    } else if (this.props.errorMessage.status.toString().startsWith(5)) {
      return (
        "Oops, something went wrong. Please contact us through the support section. Error code is: " +
        JSON.stringify(this.props.errorMessage.status) +
        JSON.stringify(this.props.errorMessage.statusText)
      );
    }
  }

  render() {
    const buttonStyle = {
      display: "block",
      margin: "10px auto"
    };
    const { handleClose, isFetching, errorMessage } = this.props;

    let message;
    let buttons;
    let defaultOptions;

    if (!isFetching) {
      message = this.whichMessage();
      buttons = this.succesButtons();
      defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: this.whichAnimation(),
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    }

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
            {isFetching ? (
              <div
                style={{
                  position: "relative",
                  top: 50,
                  height: 300,
                  bottom: 50,
                  marginLeft: "50%"
                }}
              >
                <MDSpinner size={64} />
              </div>
            ) : (
              <div>
                <div>
                  <h1 className={styles.SuccesText}>{message}</h1>
                  <Lottie
                    options={defaultOptions}
                    height={400}
                    width={400}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}
                  />
                </div>
                {buttons ? (
                  <div className={styles.SuccesText}>
                    <button
                      type="button"
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      style={{ marginTop: 10 }}
                      onClick={() =>
                        this.props.history.push("/data_management/rasters")}
                    >
                      <FormattedMessage
                        id="rasterscreen"
                        defaultMessage="Back to rasters"
                      />
                    </button>
                    <button
                      type="button"
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      style={{ marginTop: 10 }}
                      onClick={handleClose}
                    >
                      <FormattedMessage
                        id="upload"
                        defaultMessage="Upload data"
                      />
                    </button>
                  </div>
                ) : (
                  <div className={styles.SuccesText}>
                    <button
                      type="button"
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      style={{ marginTop: 10 }}
                      onClick={handleClose}
                    >
                      <FormattedMessage id="close" defaultMessage="Back" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default ErrorOverlay;
