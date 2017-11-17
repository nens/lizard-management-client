import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { Popover, PopoverItem } from "../../components/Popover";
import ContactsPicker from "./ContactsPicker";
import PaginationBar from "./PaginationBar";
import {
  fetchAlarmGroups,
  fetchContacts,
  deleteGroupById,
  fetchPaginatedContactGroups
} from "../../actions";
import styles from "./App.css";
import gridStyles from "../../styles/Grid.css";
import tableStyles from "../../styles/Table.css";
import buttonStyles from "../../styles/Buttons.css";
import { withRouter, NavLink } from "react-router-dom";
import groupsIcon from "../../images/groups@3x.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContactsPicker: false,
      contactsPickerIds: null,
      contactsPickerGroupId: null
    };
    this.handleNewGroupClick = this.handleNewGroupClick.bind(this);
    this.addIdToContactsPickerIds = this.addIdToContactsPickerIds.bind(this);
  }
  componentDidMount() {
    this.props.doFetchContacts();

    const query = new URLSearchParams(window.location.search);
    this.props.fetchPaginatedContactGroups(query.get("page") || 1);
  }
  handleNewGroupClick(e) {
    this.props.history.push("groups/new");
  }
  addIdToContactsPickerIds(id) {
    this.setState({
      contactsPickerIds: this.state.contactsPickerIds.concat([id])
    });
  }
  render() {
    const {
      groups,
      isFetching,
      doDeleteGroupById,
      currentPage,
      total
    } = this.props;
    const {
      showContactsPicker,
      contactsPickerIds,
      contactsPickerGroupId
    } = this.state;
    const numberOfGroups = total;
    return (
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row} ${styles.App}`}>
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
          >
            {numberOfGroups} {pluralize("GROUP", numberOfGroups)}
          </div>
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
          >
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Success} ${gridStyles.FloatRight}`}
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
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
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
              <table
                className={`${tableStyles.Table} ${tableStyles.Responsive}`}
              >
                <tbody>
                  {groups.map((group, i) => {
                    const numberOfContacts = group.contacts.length;
                    return (
                      <tr key={i} className={styles.GroupRow}>
                        <td className={tableStyles.TdCol4}>
                          <NavLink to={`/alarms/groups/${group.id}`}>
                            {group.name}
                          </NavLink>
                        </td>
                        <td
                          className={`${tableStyles.TdCol1} ${gridStyles.TextCenter}`}
                        >
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
                        <td className={tableStyles.TdCol1}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-evenly"
                            }}
                          >
                            <div
                              onClick={() =>
                                this.setState({
                                  showContactsPicker: true,
                                  contactsPickerGroupId: group.id,
                                  contactsPickerIds: group.contacts.map(
                                    contact => contact.id
                                  )
                                })}
                              className={styles.MoreButton}
                            >
                              <i className="material-icons text-muted">
                                group_add
                              </i>
                            </div>
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styles.NoResults}>
                <img src={groupsIcon} alt="Groups" />
                <h5>No groups configured...</h5>
              </div>
            )}
          </div>
        </div>
        {showContactsPicker ? (
          <ContactsPicker
            addIdToContactsPickerIds={this.addIdToContactsPickerIds}
            contactsPickerGroupId={contactsPickerGroupId}
            contactsPickerIds={contactsPickerIds}
            handleClose={() =>
              this.setState({
                showContactsPicker: false,
                contactsPickerIds: null,
                contactsPickerGroupId: null
              })}
          />
        ) : null}
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <PaginationBar
              page={currentPage}
              pages={Math.ceil(total / 10)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    groups: state.alarms._contactGroups.contactGroups,
    isFetching: state.alarms._contactGroups.isFetching,
    currentPage: state.alarms._contactGroups.currentPage,
    total: state.alarms._contactGroups.total
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchGroups: () => dispatch(fetchAlarmGroups()),
    doDeleteGroupById: id => dispatch(deleteGroupById(id)),
    doFetchContacts: () => dispatch(fetchContacts()),
    fetchPaginatedContactGroups: page => dispatch(fetchPaginatedContactGroups(page))
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
