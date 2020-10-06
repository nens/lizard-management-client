import buttonStyles from "../../styles/Buttons.css";
import CSSTransition from "react-transition-group/CSSTransition";
import formStyles from "../../styles/Forms.css";
import React, { Component } from "react";
import styles from "./ConfigureThreshold.css";
import ThresholdChart from "./ThresholdChart";
import { FormattedMessage } from "react-intl";
import { Scrollbars } from "react-custom-scrollbars";

class ConfigureThreshold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      value: "",
      warning_level: ""
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.handleChangeWarningLevel = this.handleChangeWarningLevel.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize, false);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
  }
  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  handleChangeValue(e) {
    this.setState({
      value: parseFloat(e.target.value)
    });
  }
  handleChangeWarningLevel(e) {
    this.setState({
      warning_level: e.target.value
    });
  }
  render() {
    const { handleClose, raster, timeseries, handleAddThreshold } = this.props;
    const { value, warning_level } = this.state;
    return (
      <div className={styles.ConfigureThresholdContainer}>
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
          <div className={styles.ConfigureThreshold}>
            <div className={styles.CloseButton} onClick={handleClose}>
              <i className="material-icons">close</i>
            </div>
            <h2>
              {" "}
              <FormattedMessage
                id="notifications_app.configure_new_threshold"
                defaultMessage="Configure new threshold"
              />
            </h2>
            <p className="text-muted">
              <FormattedMessage
                id="notifications_app.a_threshold_determines_when_an_alarm_should_be_triggered"
                defaultMessage="A threshold determines when an alarm should be triggered"
              />
            </p>
            <Scrollbars
              style={{ width: "100%", height: this.state.height - 400 }}
            >
              <div
                className={formStyles.FormGroup}
                style={{
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label htmlFor="val">
                  <FormattedMessage
                    id="notifications_app.value"
                    defaultMessage="value"
                  />
                </label>
                <input
                  className={`${formStyles.FormGroup} ${formStyles.Large}`}
                  type="number"
                  id="val"
                  value={value}
                  onChange={this.handleChangeValue}
                  placeholder=""
                />
                <small className="form-text text-muted">
                  <FormattedMessage
                    id="notifications_app.value_of_this_threshold"
                    defaultMessage="Value of this threshold (float-point number)"
                  />
                </small>
              </div>
              <div className={formStyles.FormGroup}>
                <label htmlFor="warning_level">
                  <FormattedMessage
                    id="notifications_app.warning_level"
                    defaultMessage="Warning level"
                  />
                </label>
                <input
                  className={`${formStyles.FormControl} ${formStyles.Large}`}
                  type="text"
                  id="warning_level"
                  value={warning_level}
                  onChange={this.handleChangeWarningLevel}
                  placeholder=""
                />
                <small className="form-text text-muted">
                  <FormattedMessage
                    id="notifications_app.warning_level_label"
                    defaultMessage="A warning level label. For example: 'Major'"
                  />
                </small>
              </div>
              {raster && timeseries ? (
                <ThresholdChart
                  timeseries={timeseries}
                  value={value}
                  parameter={
                    raster.observation_type
                      ? raster.observation_type.parameter
                      : null
                  }
                  unit={
                    raster.observation_type
                      ? raster.observation_type.unit
                      : null
                  }
                  code={
                    raster.observation_type
                      ? raster.observation_type.code
                      : null
                  }
                />
              ) : null}
            </Scrollbars>
            <hr />
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={() => {
                handleAddThreshold(value, warning_level);
                handleClose();
              }}
            >
              <FormattedMessage
                id="notifications_app.apply"
                defaultMessage="Apply"
              />
            </button>
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
              style={{ marginLeft: 15 }}
              onClick={handleClose}
            >
              <FormattedMessage
                id="notifications_app.close"
                defaultMessage="Close"
              />
            </button>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default ConfigureThreshold;
