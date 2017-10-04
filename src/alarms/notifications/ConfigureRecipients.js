import React, { Component } from "react";
import styles from "./ConfigureRecipients.css";
import CSSTransition from "react-transition-group/CSSTransition";

class ConfigureRecipients extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    const {handleClose} = this.props;
    return (
      <div className={styles.ConfigureRecipientsContainer}>
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
          <div className={styles.ConfigureRecipients}>
            <div className={styles.CloseButton} onClick={handleClose}>
              <i className="material-icons">close</i>
            </div>
            <h3>Configure recipients</h3>
            <p className="text-muted">
              Recipients will receive a message when the threshold is exceeded.
            </p>

          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default ConfigureRecipients;
