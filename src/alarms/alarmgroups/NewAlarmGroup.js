import React, { Component } from "react";
// import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { createGroup } from "../../actions";
// import styles from "./NewAlarmGroup.css";
import gridStyles from "../../styles/Grid.css";
import formStyles from "../../styles/Forms.css";
import tableStyles from "../../styles/Table.css";
import buttonStyles from "../../styles/Buttons.css";

import { withRouter } from "react-router-dom";


class NewAlarmGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClickCreateGroupButton = this.handleClickCreateGroupButton.bind(this);
  }
  componentDidMount() {
    try {
      document.getElementById("groupName").focus();
    } catch(e) {
      console.log("Could not focus() on input element..");
    }
  }
  handleClickCreateGroupButton() {
    const { organisation, history } = this.props;
    const groupName = document.getElementById("groupName").value;
    if (groupName.length > 0) {
      this.props.doCreateGroup({
        name: groupName,
        contacts: [],
        organisation: organisation.unique_id
      });
      history.push("/alarms/groups");
    }
  }
  render() {
    return (
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row}`}>
          <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
            <div className={formStyles.FormGroup}>
            <input
              className={formStyles.FormControl}
              type="text"
              id="groupName"
              defaultValue=""
              placeholder=""
              maxLength={80}
            />
            <small id="helpText" className="form-text text-muted">
              Please provide a name for this group (max. 80 characters)
            </small>
            </div>
          </div>
        </div>
        <div className={`${gridStyles.Row}`}>
          <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={this.handleClickCreateGroupButton}
            >
              <FormattedMessage
                id="alarmgroups_new.create_group"
                defaultMessage="Create group"
              />
              <Ink />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    template: state.alarms.template,
    isFetching: state.alarms.isFetching,
    organisation: state.bootstrap.organisation
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doCreateGroup: data => dispatch(createGroup(data))
  };
};

const App = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewAlarmGroup)
);

export { App };
