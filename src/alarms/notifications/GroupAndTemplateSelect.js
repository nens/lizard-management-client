import React, { Component } from "react";
import styles from "./GroupAndTemplateSelect.css";

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
      <div className={styles.GroupAndTemplateSelect}>
        <div className="form-row">
          <div className="form-group col-md-4">
            <select
              id="group"
              className="form-control"
              onChange={this.selectGroup}
            >
              <option>Select a group</option>
              {availableGroups.map((group, i) => {
                return (
                  <option key={i} value={group.name}>
                    {group.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group col-md-4">
            <select
              id="template"
              className="form-control"
              onChange={this.selectMessage}
            >
              <option>Select a template</option>
              {availableMessages.map((message, i) => {
                return (
                  <option key={i} value={message.name}>
                    {message.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group col-md-4">
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => removeFromGroupAndTemplate(idx)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default GroupAndTemplateSelect;
