import buttonStyles from "../../styles/Buttons.module.css";
import ContactsPicker from "./ContactsPicker";
import gridStyles from "../../styles/Grid.module.css";
import groupsIcon from "../../images/group.svg";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import PaginationBar from "./PaginationBar";
import React, { Component } from "react";
import styles from "./App.module.css";
import tableStyles from "../../styles/Table.module.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Popover, PopoverItem } from "../../components/Popover";
import { withRouter, NavLink } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContactsPicker: false,
      contactsPickerIds: null,
      contactsPickerGroupId: null,
      isFetching: true,
      page: 1,
      total: 0,
      contactgroups: []
    };
    this.handleNewGroupClick = this.handleNewGroupClick.bind(this);
    this.addIdToContactsPickerIds = this.addIdToContactsPickerIds.bind(this);
    this.loadContactGroupsOnPage = this.loadContactGroupsOnPage.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadContactGroupsOnPage(page);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedOrganisation &&
      prevProps.selectedOrganisation.uuid !== this.props.selectedOrganisation.uuid
    ) {
      const { page } = this.state;
      this.loadContactGroupsOnPage(page);
    }
  }

  loadContactGroupsOnPage(page) {
    const { selectedOrganisation } = this.props;
    const organisationId = selectedOrganisation.uuid;

    this.setState({
      isFetching: true
    });

    const url = `/api/v3/contactgroups/?page=${page}&organisation__unique_id=${organisationId}`;
    const opts = { credentials: "same-origin" };

    fetch(url, opts)
      .then(responseObj => responseObj.json())
      .then(responseData => {
        this.setState({
          isFetching: false,
          contactgroups: responseData.results,
          total: responseData.count,
          page: page
        });
      });
  }

  deleteGroupById(groupid) {
    const { addNotification } = this.props;
    fetch(`/api/v3/contactgroups/${groupid}/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        this.loadContactGroupsOnPage(1);
        addNotification(`Group removed`, 2000);
      }
    });
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
      showContactsPicker,
      contactsPickerIds,
      contactsPickerGroupId,
      isFetching,
      total,
      page,
      contactgroups
    } = this.state;
    const numberOfGroups = total;
    return (
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row} ${styles.App}`}>
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
          >
            <FormattedMessage
              id="alarmgroups_app.number_of_groups"
              defaultMessage={`{numberOfGroups, number} {numberOfGroups, plural, 
                one {GROUP}
                other {GROUPS}}`}
              values={{ numberOfGroups }}
            />
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
            ) : contactgroups.length > 0 ? (
              <table
                className={`${tableStyles.Table} ${tableStyles.Responsive}`}
              >
                <tbody>
                  {contactgroups.map((group, i) => {
                    const numberOfContacts = group.contacts.length;
                    return (
                      <tr key={group.id} className={styles.GroupRow}>
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
                            <FormattedMessage
                              id="alarmgroups_app.number_of_contacts"
                              defaultMessage={`{numberOfContacts, plural, 
                                one {contact}
                                other {contacts}}`}
                              values={{ numberOfContacts }}
                            />
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
                                    this.deleteGroupById(group.id);
                                  }
                                }}
                              >
                                <FormattedMessage
                                  id="alarmgroups_app.delete_group"
                                  defaultMessage="Delete group"
                                />
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
                <h5>
                  <FormattedMessage
                    id="alarmgroups_app.no_groups_configured"
                    defaultMessage="No groups configured..."
                  />
                </h5>
              </div>
            )}
          </div>
        </div>
        {showContactsPicker ? (
          <ContactsPicker
            addIdToContactsPickerIds={this.addIdToContactsPickerIds}
            contactsPickerGroupId={contactsPickerGroupId}
            contactsPickerIds={contactsPickerIds}
            loadContactGroupsOnPage={this.loadContactGroupsOnPage}
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
              loadContactGroupsOnPage={this.loadContactGroupsOnPage}
              page={page}
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
    availableOrganisations: state.organisations.available,
    selectedOrganisation: state.organisations.selected
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
