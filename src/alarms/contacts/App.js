import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import ActionBar from "./ActionBar";
import PaginationBar from "./PaginationBar";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchPaginatedContacts } from "../../actions";
import styles from "./App.css";
import gridStyles from "../../styles/Grid.css";
import tableStyles from "../../styles/Table.css";
import buttonStyles from "../../styles/Buttons.css";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: ""
    };
    this.handleFilter = this.handleFilter.bind(this);
  }
  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    this.props.fetchPaginatedContacts(query.get("page") || 1);
  }
  handleFilter(e) {
    this.setState({
      filterValue: e.target.value
    });
  }
  render() {
    const {
      contacts,
      currentPage,
      isFetching,
      total
    } = this.props;
    const { filterValue } = this.state;

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

    const numberOfContacts = total;

    const filteredContacts = contacts.filter((contact, i) => {
      if (
        contact.first_name.toLowerCase().indexOf(filterValue) !== -1 ||
        contact.last_name.toLowerCase().indexOf(filterValue) !== -1
      ) {
        return contact;
      }
      return false;
    });
    return (
      <div className={gridStyles.Container}>
        <div className={`${gridStyles.Row} ${styles.App}`}>
          <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
            {numberOfContacts} {pluralize("CONTACT", numberOfContacts)}
            <button type="button" className={`${buttonStyles.Button} ${buttonStyles.Success} ${gridStyles.FloatRight}`}>
              <FormattedMessage
                id="contacts_app.new_contact"
                defaultMessage="New contact"
              />
              <Ink />
            </button>
          </div>
        </div>
        <br/>
        <div className={`${gridStyles.Row}`}>
          <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
            <ActionBar handleFilter={this.handleFilter} />
            <table className={`${tableStyles.Table} ${tableStyles.Responsive}`}>
              <thead style={{ backgroundColor: "#D8D8D8" }}>
                <tr className="text-muted">
                  <td>&nbsp;</td>
                  <td>First name</td>
                  <td>Last name</td>
                  <td>E-mail address</td>
                  <td>Telephone number</td>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <input
                          type="checkbox"
                          name="contact"
                          className="checkbox"
                          value={contact.id}
                        />
                      </td>
                      <td>{contact.first_name}</td>
                      <td>{contact.last_name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone_number}</td>
                    </tr>
                  );
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
    contacts: state.alarms._contacts.contacts,
    isFetching: state.alarms._contacts.isFetching,
    currentPage: state.alarms._contacts.currentPage,
    total: state.alarms._contacts.total
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPaginatedContacts: page => dispatch(fetchPaginatedContacts(page))
  };
};


App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
