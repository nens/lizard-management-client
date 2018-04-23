import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import ActionBar from "./ActionBar";
import PaginationBar from "./PaginationBar";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import styles from "./App.css";
import gridStyles from "../../styles/Grid.css";
import tableStyles from "../../styles/Table.css";
import buttonStyles from "../../styles/Buttons.css";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: "",
      page: 1,
      total: 0,
      isFetching: true,
      contacts: []
    };
    this.handleFilter = this.handleFilter.bind(this);
    this.loadContactsOnPage = this.loadContactsOnPage.bind(this);
    this.handleNewContactClick = this.handleNewContactClick.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadContactsOnPage(page);
  }
  handleNewContactClick(e) {
    this.props.history.push("contacts/new");
  }
  loadContactsOnPage(page) {
    const { bootstrap } = this.props;
    const organisationId = bootstrap.organisation.unique_id;
    this.setState({
      isFetching: true
    });
    fetch(
      `/api/v3/contacts/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
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
    const { total, isFetching, page, contacts, filterValue } = this.state;

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
            {total} {pluralize("CONTACT", total)}
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
            <ActionBar handleFilter={this.handleFilter} />
            <table className={`${tableStyles.Table} ${tableStyles.Responsive}`}>
              <thead style={{ backgroundColor: "#D8D8D8" }}>
                <tr className="text-muted">
                  <td>First name</td>
                  <td>Last name</td>
                  <td>E-mail address</td>
                  <td>Telephone number</td>
                  <td>&nbsp;</td>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, i) => {
                  // If contact.user is not null, that means a Django User is linked to this contact
                  // so show contact.user.first_name etcetera
                  if (contact.user) {
                    return (
                      <tr key={i}>
                        <td>{contact.user.first_name}</td>
                        <td>{contact.user.last_name}</td>
                        <td>{contact.user.email}</td>
                        <td>{contact.user.phone_number}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => console.log("Delete", contact)}
                            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Danger2} ${gridStyles.FloatRight}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  } else {
                    // Otherwise, no Django User is linked, so show contact.first_name etc.
                    return (
                      <tr key={i}>
                        <td>{contact.first_name}</td>
                        <td>{contact.last_name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone_number}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => console.log("Delete", contact)}
                            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Danger2} ${gridStyles.FloatRight}`}
                          >
                            Delete
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
    bootstrap: state.bootstrap
  };
};

App = withRouter(connect(mapStateToProps, null)(App));

export { App };
