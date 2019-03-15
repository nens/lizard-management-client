import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import styles from "./GroupAndTemplateSelect.css";
import formStyles from "../../styles/Forms.css";
import gridStyles from "../../styles/Grid.css";
import buttonStyles from "../../styles/Buttons.css";

class GroupAndTemplateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroupName: null,
      selectedMessageName: null
    };
    this.selectGroup = this.selectGroup.bind(this);
    this.selectMessage = this.selectMessage.bind(this);
  }
  selectGroup(e) {
    this.setState(
      {
        selectedGroupName: e.target.value
      },
      () => {
        if (this.state.selectedMessageName && this.state.selectedGroupName) {
          this.props.addGroupAndTemplate({
            idx: this.props.idx,
            groupName: this.state.selectedGroupName,
            messageName: this.state.selectedMessageName
          });
        }
      }
    );
  }
  selectMessage(e) {
    this.setState(
      {
        selectedMessageName: e.target.value
      },
      () => {
        if (this.state.selectedMessageName && this.state.selectedGroupName) {
          this.props.addGroupAndTemplate({
            idx: this.props.idx,
            groupName: this.state.selectedGroupName,
            messageName: this.state.selectedMessageName
          });
        }
      }
    );
  }
  render() {
    const {
      availableGroups,
      availableMessages,
      removeFromGroupAndTemplate,
      idx
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
              <FormattedMessage
                id="notifications_app.select_a_group"
                defaultMessage="Select a group"
                tagName="option"
              />
              {availableGroups.map((group, i) => {
                return (
                  <option key={group.id} value={group.name}>
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
              <FormattedMessage
                id="notifications_app.select_a_template"
                defaultMessage="Select a template"
                tagName="option"
              />
              {availableMessages.map((message, i) => {
                return (
                  <option key={message.id} value={message.name}>
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
