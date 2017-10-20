import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchAlarmGroups } from "../../actions";
import styles from "./App.css";
import { withRouter, NavLink } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleNewGroupClick = this.handleNewGroupClick.bind(this);
  }
  componentDidMount() {
    this.props.doFetchGroups();
  }
  handleNewGroupClick(e) {
    console.log("New group plz");
    // this.props.history.push("groups/new");
  }
  render() {
    const { groups, isFetching } = this.props;
    const numberOfGroups = groups.length;
    return (
      <div className="container">
        <div className={`row align-items-center ${styles.App}`}>
          <div className="col-sm-8 justify-content-center text-muted">
            {numberOfGroups} {pluralize("GROUP", numberOfGroups)}
          </div>
          <div className="col-sm-4">
            <button
              type="button"
              className="btn btn-success float-right"
              onClick={this.handleNewGroupClick}
            >
              <FormattedMessage
                id="alarmgroups_app.new_group"
                defaultMessage="New group"
              />
              <Ink />
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            {isFetching ? (
              <div
                style={{
                  position: "relative",
                  top: 50,
                  height: 300,
                  bottom: 50,
                  marginLeft: "50%"
                }}
              >
                <MDSpinner size={24} />
              </div>
            ) : groups.length > 0 ? (
              <table className="table table-responsive">
                <tbody>
                  {groups.map((group, i) => {
                    const numberOfContacts = group.contacts.length;
                    return (
                      <tr key={i} className={styles.GroupRow}>
                        <td
                          className="col-md-8"
                          onClick={() =>
                            console.log(`Go to detail page of ${group.name}`)}
                        >
                          <NavLink to={`/alarms/groups/${group.id}`}>
                            <strong>{group.name}</strong>
                          </NavLink>
                        </td>
                        <td className="col-md-2 text-center">
                          <p
                            className={`${styles.NumberOfContacts} text-muted`}
                          >
                            {numberOfContacts}
                          </p>
                          <p
                            className={`${styles.NumberOfContactsText} text-muted`}
                          >
                            {pluralize("contacts", numberOfContacts)}
                          </p>
                        </td>
                        <td className="col-md-1">
                          <div
                            onClick={e => console.log("Add contacts to group")}
                            style={{
                              backgroundColor: "#D8D8D8",
                              borderRadius: 2,
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer"
                            }}
                          >
                            <i className="material-icons text-muted">
                              group_add
                            </i>
                          </div>
                        </td>
                        <td className="col-md-1">
                          <div
                            onClick={e => console.log("Group options")}
                            style={{
                              backgroundColor: "#D8D8D8",
                              borderRadius: 2,
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer"
                            }}
                          >
                            <i className="material-icons text-muted">
                              keyboard_arrow_down
                            </i>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styles.NoResults}>
                <img src="/images/groups@3x.svg" alt="Groups" />
                <h5>No groups configured...</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    groups: state.alarms.groups,
    isFetching: state.alarms.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchGroups: () => dispatch(fetchAlarmGroups())
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
