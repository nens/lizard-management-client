import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./GroupAndTemplateSelect.module.css";
import formStyles from "../../styles/Forms.module.css";
import gridStyles from "../../styles/Grid.module.css";
import buttonStyles from "../../styles/Buttons.module.css";

class GroupAndTemplateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroupId: null,
      selectedMessageId: null
    };
    this.selectGroup = this.selectGroup.bind(this);
    this.selectMessage = this.selectMessage.bind(this);
  }
  selectGroup(e) {
    this.setState(
      {
        selectedGroupId: parseFloat(e.target.value)
      },
      () => {
        if (this.state.selectedMessageId && this.state.selectedGroupId) {
          this.props.addGroupAndTemplate({
            idx: this.props.idx,
            groupId: this.state.selectedGroupId,
            messageId: this.state.selectedMessageId
          });
        }
      }
    );
  }
  selectMessage(e) {
    this.setState(
      {
        selectedMessageId: parseFloat(e.target.value)
      },
      () => {
        if (this.state.selectedMessageId && this.state.selectedGroupId) {
          this.props.addGroupAndTemplate({
            idx: this.props.idx,
            groupId: this.state.selectedGroupId,
            messageId: this.state.selectedMessageId
          });
        }
      }
    );
  }
  getMessageName(messages, messageId) {
    if (messages.length === 0) return null;
    const selectedMessage = messages.find(message => message.id === messageId);
    return selectedMessage ? selectedMessage.name : "Select a template";
  }
  getGroupName(groups, groupId) {
    if (groups.length === 0) return null;
    const selectedGroup = groups.find(group => group.id === groupId);
    return selectedGroup ? selectedGroup.name : "Select a group";
  }
  componentDidMount() {
    this.setState({
      selectedGroupId: this.props.groupId,
      selectedMessageId: this.props.messageId
    });
  }
  render() {
    const {
      availableGroups,
      availableMessages,
      removeFromGroupAndTemplate,
      idx,
      groupId,
      messageId
    } = this.props;
    return (
      <div className={styles.GroupAndTemplateSelector}>
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4} ${formStyles.FormGroup}`}
          >
            <select
              id="group"
              className={formStyles.FormControl}
              onChange={this.selectGroup}
            >
              <option value={groupId}>
                {groupId ? this.getGroupName(availableGroups, groupId) : "Select a group"}
              </option>
              {availableGroups.map((group, i) => {
                return (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4} ${formStyles.FormGroup}`}
          >
            <select
              id="template"
              className={formStyles.FormControl}
              onChange={this.selectMessage}
            >
              <option value={messageId}>
                {messageId ? this.getMessageName(availableMessages, messageId) : "Select a template"}
              </option>
              {availableMessages.map((message, i) => {
                return (
                  <option key={message.id} value={message.id}>
                    {message.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div
            className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4} ${formStyles.FormGroup}`}
          >
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
              onClick={() => removeFromGroupAndTemplate(idx)}
            >
              <FormattedMessage
                id="notifications_app.group_and_template_remove"
                defaultMessage="Remove"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupAndTemplateSelect;
