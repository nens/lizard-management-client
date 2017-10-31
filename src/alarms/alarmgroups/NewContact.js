import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { fetchContacts } from "../../actions";
// import styles from "./NewContact.css";
import { withRouter } from "react-router-dom";

class NewContact extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // this.handleClickCreateGroupButton = this.handleClickCreateGroupButton.bind(this);
  }
  componentDidMount() {
    const { doFetchContacts } = this.props;
    doFetchContacts();
    // document.getElementById("firstName").focus();
  }
  handleClickCreateGroupButton() {
    // const { organisation, history } = this.props;
    // const groupName = document.getElementById("groupName").value;
    // if (groupName.length > 0) {
    //   this.props.doCreateGroup({
    //     name: groupName,
    //     contacts: [],
    //     organisation: organisation.unique_id
    //   });
    //   history.push("/alarms/groups");
    // }
  }
  render() {
    const { contacts, isFetching } = this.props;

    if (isFetching) {
      return (
        <div
          style={{
            position: "relative",
            top: 50,
            height: 50,
            bottom: 50,
            marginLeft: "50%"
          }}
        >
          <MDSpinner size={24} />
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <table className="table table-small table-striped">
              <thead>
                <tr>
                  <td>First name</td>
                  <td>Last name</td>
                  <td>E-mail</td>
                  <td>Phone</td>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, i) => {
                  return (
                    <tr key={i}>
                      <td>{contact.first_name || "-"}</td>
                      <td>{contact.last_name || "-"}</td>
                      <td>{contact.email || "-"}</td>
                      <td>{contact.phone_number || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <button type="button" className="btn btn-success">
              <FormattedMessage
                id="alarmgroups_new.create_group"
                defaultMessage="Add selected contacts"
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
    isFetching: state.alarms.isFetching,
    organisation: state.bootstrap.organisation,
    contacts: state.alarms.contacts
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchContacts: () => dispatch(fetchContacts())
  };
};

const App = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewContact)
);

export { App };
