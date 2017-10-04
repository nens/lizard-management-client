import React, { Component } from "react";
import styles from "./ConfigureThreshold.css";
import { Scrollbars } from "react-custom-scrollbars";
import CSSTransition from "react-transition-group/CSSTransition";
import ThresholdChart from "./ThresholdChart";

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
            <h3>Configure new threshold</h3>
            <p className="text-muted">
              A threshold determines when an alarm should be triggered.
            </p>
            <Scrollbars
              style={{ width: "100%", height: this.state.height - 400 }}
            >
              <div className="form-group">
                <label htmlFor="val">Value</label>
                <input
                  className="form-control form-control-lg"
                  type="number"
                  id="val"
                  value={value}
                  onChange={this.handleChangeValue}
                  placeholder=""
                />
                <small className="form-text text-muted">
                  Value of this threshold (float-point number)
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="warning_level">Warning level</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  id="warning_level"
                  value={warning_level}
                  onChange={this.handleChangeWarningLevel}
                  placeholder=""
                />
                <small className="form-text text-muted">
                  A warning level label. For example: "Exceeded"
                </small>
              </div>
              {raster && timeseries
                ? <ThresholdChart
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
                : null}
            </Scrollbars>
            <hr />
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                handleAddThreshold(value, warning_level);
                handleClose();
              }}
            >
              Apply
            </button>
            <button
              type="button"
              className="btn btn-sm btn-link"
              style={{ marginLeft: 15 }}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default ConfigureThreshold;
