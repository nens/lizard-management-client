import React, { Component } from "react";
// import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { createGroup } from "../../actions";
// import styles from "./NewAlarmGroup.css";
import { withRouter } from "react-router-dom";


class NewAlarmGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClickCreateGroupButton = this.handleClickCreateGroupButton.bind(this);
  }
  componentDidMount() {
    document.getElementById("groupName").focus();
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
      <div className="container">
        <div className="row">
          <div className="col-md-12 form-group">
            <input
              className="form-control"
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
        <div className="row">
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-success"
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
