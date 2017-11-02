import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import ActionBar from "./ActionBar";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchContacts } from "../../actions";
import styles from "./App.css";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.doFetchContacts();
  }
  render() {
    const { isFetching, contacts } = this.props;

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

    const numberOfContacts = contacts.length;
    return (
      <div className="container">
        <div className={`row align-items-center ${styles.App}`}>
          <div className="col-sm-8 justify-content-center text-muted">
            {numberOfContacts} {pluralize("CONTACT", numberOfContacts)}
          </div>
          <div className="col-sm-4">
            <button type="button" className="btn btn-success float-right">
              <FormattedMessage
                id="contacts_app.new_contact"
                defaultMessage="New contact"
              />
              <Ink />
            </button>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-12">
            <ActionBar />
            <table className="table table-responsive">
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
                {contacts.map((contact, i) => {
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.alarms.isFetching,
    contacts: state.alarms.contacts
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchContacts: () => dispatch(fetchContacts())
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
