import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { Popover, PopoverItem } from "../../components/Popover";
import { fetchAlarmGroups, deleteGroupById } from "../../actions";
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
    this.props.history.push("groups/new");
  }
  render() {
    const { groups, isFetching, doDeleteGroupById, history } = this.props;
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
                            {group.name}
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
                            onClick={() => history.push(`/alarms/groups/${group.id}/new`)}
                            className={styles.MoreButton}
                          >
                            <i className="material-icons text-muted">
                              group_add
                            </i>
                          </div>
                        </td>
                        <td className="col-md-1">
                          <Popover
                            element={
                              <div className={styles.MoreButton}>
                                <i className="material-icons text-muted">
                                  keyboard_arrow_down
                                </i>
                              </div>
                            }
                          >
                            <PopoverItem
                              handleOnClick={() => {
                                if (window.confirm("Are you sure?")) {
                                  doDeleteGroupById(group.id);
                                }
                              }}
                            >
                              Delete group
                            </PopoverItem>
                          </Popover>
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
    doFetchGroups: () => dispatch(fetchAlarmGroups()),
    doDeleteGroupById: id => dispatch(deleteGroupById(id))
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
