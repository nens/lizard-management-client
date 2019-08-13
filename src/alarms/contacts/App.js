import React, { Component } from "react";
import { addNotification } from "../../actions";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
// import ActionBar from "./ActionBar";
import PaginationBar from "./PaginationBar";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styles from "./App.css";
import gridStyles from "../../styles/Grid.css";
import tableStyles from "../../styles/Table.css";
import buttonStyles from "../../styles/Buttons.css";
import { withRouter, NavLink } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: "",
      page: 1,
      total: 0,
      isFetching: true,
      contacts: [],
      ordering: {
        column: "first_name",
        direction: ""
      }
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.loadContactsOnPage = this.loadContactsOnPage.bind(this);
    this.handleNewContactClick = this.handleNewContactClick.bind(this);
    this.handleDeleteContact = this.handleDeleteContact.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadContactsOnPage(page);
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedOrganisation &&
      prevProps.selectedOrganisation.uuid !== this.props.selectedOrganisation.uuid
    ) {
      const { page } = this.state;
      this.loadContactsOnPage(page);
    }
  }
  handleNewContactClick(e) {
    this.props.history.push("contacts/new");
  }
  handleDeleteContact(contact) {
    const { addNotification } = this.props;
    const sure = window.confirm("Are you sure?");
    if (sure) {
      fetch(`/api/v3/contacts/${contact.id}/`, {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }).then(response => {
        if (response.status === 204) {
          addNotification(`Contact deleted`, 2000);
          this.loadContactsOnPage(1);
        } else {
          addNotification(`Something went wrong, contact not deleted`, 2000);
        }
      });
    }
  }
  loadContactsOnPage(page) {
    const { ordering } = this.state;
    const organisationId = this.props.selectedOrganisation.uuid;
    this.setState({
      isFetching: true
    });

    const url = `/api/v3/contacts/?page=${page}&organisation__unique_id=${organisationId}${ordering.column
      ? `&ordering=${ordering.direction}${ordering.column}`
      : ""}`;
    const opts = { credentials: "same-origin" };
    fetch(url, opts)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetching: false,
          contacts: data.results,
          total: data.count,
          page: page
        });
      });
  }

  handleFilter(e) {
    this.setState({
      filterValue: e.target.value
    });
  }
  render() {
    const {
      total,
      isFetching,
      page,
      contacts,
      filterValue,
      ordering
    } = this.state;

    const filteredContacts = contacts.filter((contact, i) => {
      if (
        contact.first_name.toLowerCase().indexOf(filterValue) !== -1 ||
        contact.last_name.toLowerCase().indexOf(filterValue) !== -1
      ) {
        return contact;
      }
      return false;
    });

    if (isFetching) {
      return (
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
      );
    }

    return (
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row} ${styles.App}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <FormattedMessage
              id="contacts_app.number_of_contacts"
              defaultMessage={`{total, number} {total, plural, 
                one {CONTACT}
                other {CONTACTS}}`}
              values={{ total }}
            />

            <button
              type="button"
              onClick={this.handleNewContactClick}
              className={`${buttonStyles.Button} ${buttonStyles.Success} ${gridStyles.FloatRight}`}
            >
              <FormattedMessage
                id="contacts_app.new_contact"
                defaultMessage="New contact"
              />
              <Ink />
            </button>
          </div>
        </div>
        <br />
        <div className={`${gridStyles.Row}`}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            {/* <ActionBar handleFilter={this.handleFilter} /> */}
            <table className={`${tableStyles.Table} ${tableStyles.Responsive}`}>
              <thead style={{ backgroundColor: "#D8D8D8" }}>
                <tr className="text-muted">
                  <td
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() =>
                      this.setState(
                        {
                          ordering: {
                            column: "first_name",
                            direction: ordering.direction === "-" ? "" : "-"
                          }
                        },
                        () => this.loadContactsOnPage(page)
                      )}
                  >
                    <FormattedMessage
                      id="contacts_app.first_name"
                      defaultMessage="First name"
                    />
                    {ordering.column === "first_name" ? (
                      ordering.direction === "-" ? (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_up
                        </i>
                      ) : (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_down
                        </i>
                      )
                    ) : null}
                  </td>
                  <td
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() =>
                      this.setState(
                        {
                          ordering: {
                            column: "last_name",
                            direction: ordering.direction === "-" ? "" : "-"
                          }
                        },
                        () => this.loadContactsOnPage(page)
                      )}
                  >
                    <FormattedMessage
                      id="contacts_app.last_name"
                      defaultMessage="Last name"
                    />
                    {ordering.column === "last_name" ? (
                      ordering.direction === "-" ? (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_up
                        </i>
                      ) : (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_down
                        </i>
                      )
                    ) : null}
                  </td>
                  <td
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() =>
                      this.setState(
                        {
                          ordering: {
                            column: "email",
                            direction: ordering.direction === "-" ? "" : "-"
                          }
                        },
                        () => this.loadContactsOnPage(page)
                      )}
                  >
                    {" "}
                    <FormattedMessage
                      id="contacts_app.email_address"
                      defaultMessage="E-mail address"
                    />{" "}
                    {ordering.column === "email" ? (
                      ordering.direction === "-" ? (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_up
                        </i>
                      ) : (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_down
                        </i>
                      )
                    ) : null}
                  </td>
                  <td
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() =>
                      this.setState(
                        {
                          ordering: {
                            column: "phone_number",
                            direction: ordering.direction === "-" ? "" : "-"
                          }
                        },
                        () => this.loadContactsOnPage(page)
                      )}
                  >
                    {" "}
                    <FormattedMessage
                      id="contacts_app.phone_number"
                      defaultMessage="Telephone number"
                    />{" "}
                    {ordering.column === "phone_number" ? (
                      ordering.direction === "-" ? (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_up
                        </i>
                      ) : (
                        <i
                          style={{ position: "absolute", right: 0 }}
                          className="material-icons"
                        >
                          arrow_drop_down
                        </i>
                      )
                    ) : null}
                  </td>
                  <td>&nbsp;</td>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, i) => {
                  // If contact.user is not null, that means a Django User is linked to this contact
                  // so show contact.user.first_name etcetera
                  if (contact.user) {
                    return (
                      <tr key={contact.id}>
                        <td>
                          <NavLink
                            to={`/alarms/contacts/${contact.id}`}
                            style={{ color: "#000" }}
                          >
                            {contact.user.first_name}
                          </NavLink>
                        </td>
                        <td>
                          <NavLink
                            to={`/alarms/contacts/${contact.id}`}
                            style={{ color: "#000" }}
                          >
                            {contact.user.last_name}
                          </NavLink>
                        </td>
                        <td>{contact.user.email}</td>
                        <td>{contact.user.phone_number}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => this.handleDeleteContact(contact)}
                            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Danger2} ${gridStyles.FloatRight}`}
                          >
                            <FormattedMessage
                              id="contacts_app.delete"
                              defaultMessage="Delete"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    // Otherwise, no Django User is linked, so show contact.first_name etc.
                    return (
                      <tr key={contact.id}>
                        <td>
                          <NavLink
                            to={`/alarms/contacts/${contact.id}`}
                            style={{ color: "#000" }}
                          >
                            {contact.first_name}
                          </NavLink>
                        </td>
                        <td>
                          <NavLink
                            to={`/alarms/contacts/${contact.id}`}
                            style={{ color: "#000" }}
                          >
                            {contact.last_name}
                          </NavLink>
                        </td>
                        <td>{contact.email}</td>
                        <td>{contact.phone_number}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => this.handleDeleteContact(contact)}
                            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Danger2} ${gridStyles.FloatRight}`}
                          >
                            <FormattedMessage
                              id="contacts_app.delete"
                              defaultMessage="Delete"
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <PaginationBar
              loadContactsOnPage={this.loadContactsOnPage}
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
