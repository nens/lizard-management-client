import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./ConfigureRecipients.module.css";
import CSSTransition from "react-transition-group/CSSTransition";

class ConfigureRecipients extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    const { handleClose } = this.props;
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
            <h3>
              <FormattedMessage
                id="notifications_app.configure_recipients"
                defaultMessage="Configure recipients"
              />
            </h3>
            <p className="text-muted">
              <FormattedMessage
                id="notifications_app.recipients_will_receive_a_message_when_the_threshold_is_exceeded"
                defaultMessage="Recipients will receive a message when the threshold is exceeded"
              />
            </p>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default ConfigureRecipients;
