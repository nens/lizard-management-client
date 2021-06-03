import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styles from "./GroupMessage.module.css";
import gridStyles from "../../styles/Grid.module.css";
import buttonStyles from "../../styles/Buttons.module.css";
import formStyles from "../../styles/Forms.module.css";
import { addNotification } from "../../actions";
import { Scrollbars } from "react-custom-scrollbars";
import CSSTransition from "react-transition-group/CSSTransition";

class GroupMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      isSending: false,
      messageText: ""
    };
    this.handleResize = this.handleResize.bind(this);
    this.hideGroupMessage = this.hideGroupMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }
  componentDidMount() {
    try {
      document.getElementById("subject").focus();
    } catch (e) {
      console.error("Could not focus() on input element..");
    }
    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.hideGroupMessage, false);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener("keydown", this.hideGroupMessage, false);
  }
  hideGroupMessage(e) {
    if (e.key === "Escape") {
      this.props.handleClose();
    }
  }
  sendMessage() {
    const { groupId, addNotification } = this.props;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    if (subject && message) {
      this.setState({
        isSending: true
      });
      this.sendMessageToGroup(groupId, subject, message);
    } else {
      addNotification(`Please provide a subject and a message`, 2000);
    }
  }
  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  sendMessageToGroup(groupId, subject, message) {
    const { addNotification } = this.props;
    const messageData = {
      email_html: message,
      email_text: message,
      email_subject: subject,
      sms_content: message
    };
    fetch(`/api/v4/contactgroups/${groupId}/send/`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData)
    })
      .then(response => {
        if (response.status === 400) {
          addNotification(`ERROR: Message too long`, 2000);
          this.setState({
            isSending: false
          });
          return Promise.reject(response);
        }
        return response.json();
      })
      .then(data => {
        addNotification(`Message sent to group`, 2000);
        this.setState({
          isSending: false
        });
        this.props.handleClose();
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const { handleClose } = this.props;
    const { isSending, messageText } = this.state;
    return (
      <div className={styles.GroupMessageContainer}>
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
          <div className={styles.GroupMessage}>
            <div className={styles.CloseButton} onClick={handleClose}>
              <i className="material-icons">close</i>
            </div>
            <h3>
              <FormattedMessage
                id="alarmgroups_app.send_a_message_to_this_group"
                defaultMessage="Send a message to this group"
              />
            </h3>
            <br />
            <div className="form-group">
              <input
                id="subject"
                tabIndex="-1"
                type="text"
                className={formStyles.FormControl}
                placeholder="Subject of this message"
                onChange={this.handleInput}
                maxLength={80}
                disabled={isSending ? true : false}
              />
              <small className="text-muted">
                <FormattedMessage
                  id="alarmgroups_app.subject_only_applies"
                  defaultMessage="Subject (only applies to e-mail messages)"
                />
              </small>
            </div>
            <Scrollbars
              style={{ width: "100%", height: this.state.height - 400 }}
            >
              <div className={`${gridStyles.Row}`}>
                <div
                  className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12} ${formStyles.FormGroup}`}
                >
                  <textarea
                    spellCheck={false}
                    className={formStyles.FormControl}
                    id="message"
                    rows="7"
                    maxLength={160}
                    value={messageText}
                    onChange={e =>
                      this.setState({
                        messageText: e.target.value
                      })}
                    disabled={isSending ? true : false}
                    style={{
                      whiteSpace: 'pre-wrap'
                    }}
                  />
                  <small className="text-muted">
                    <FormattedMessage
                      id="alarmgroups_app.message"
                      defaultMessage="Message"
                    />{" "}
                    ({160 - messageText.length}{" "}
                    <FormattedMessage
                      id="alarmgroups_app.characters_left"
                      defaultMessage="characters left"
                    />)
                  </small>
                </div>
              </div>
            </Scrollbars>
            <hr />
            <button
              disabled={isSending ? true : false}
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={() => {
                if (!isSending) {
                  this.sendMessage();
                }
              }}
            >
              <FormattedMessage
                id="alarmgroup.send_message"
                defaultMessage="Send message"
              />
            </button>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
    addNotification: (message, timeout) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapDispatchToProps)(GroupMessage);
