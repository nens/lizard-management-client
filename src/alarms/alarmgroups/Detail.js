import ActionBar from "./ActionBar";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import GroupMessage from "./GroupMessage";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import styles from "./Detail.css";
import tableStyles from "../../styles/Table.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGroupMessageModal: false,
      contactgroup: null,
      isFetching: true
    };
    this.handleCheckboxes = this.handleCheckboxes.bind(this);
    this.handleSelectAllCheckboxes = this.handleSelectAllCheckboxes.bind(this);
    this.handleDeselectAllCheckboxes = this.handleDeselectAllCheckboxes.bind(
      this
    );
    this.showGroupMessageModal = this.showGroupMessageModal.bind(this);
    this.fetchGroupDetails = this.fetchGroupDetails.bind(this);
    this.handleRemoveContactFromGroup = this.handleRemoveContactFromGroup.bind(
      this
    );
  }

  componentDidMount() {
    const { match } = this.props;
    this.fetchGroupDetails(match.params.id);
  }

  fetchGroupDetails(groupId) {
    fetch(`/api/v3/contactgroups/${groupId}/`, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(contactgroup => {
        this.setState({
          contactgroup,
          isFetching: false
        });
      });
  }

  handleCheckboxes(e) {
    const checkboxes = [
      ...document.querySelectorAll("input[type=checkbox]:checked")
    ];
    const values = checkboxes.map(cb => cb.value);
    console.log("Selected:", values);
  }

  handleSelectAllCheckboxes() {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach(checkbox => (checkbox.checked = true));
  }

  handleDeselectAllCheckboxes() {
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach(checkbox => (checkbox.checked = false));
  }

  handleRemoveContactFromGroup(contact) {
    const sure = window.confirm("Are you sure?");
    const { match, addNotification } = this.props;
    const { contactgroup } = this.state;

    if (sure) {
      const filteredContacts = contactgroup.contacts.filter(
        c => (c.id === contact.id ? false : c)
      );

      fetch(`/api/v3/contactgroups/${match.params.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contacts: filteredContacts.map(fc => fc.id)
        })
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            ...this.state,
            contactgroup: {
              ...this.state.contactgroup,
              contacts: filteredContacts
            }
          });
          addNotification("Contact removed from group", 2000);
        });
    }
  }

  showGroupMessageModal() {
    this.setState({
      showGroupMessageModal: true
    });
  }

  render() {
    const { isFetching, contactgroup, showGroupMessageModal } = this.state;

    if (isFetching) {
      return (
        <div className={styles.LoadingIndicator}>
          <MDSpinner size={24} />
        </div>
      );
    }

    if (contactgroup && contactgroup.contacts) {
      const numberOfContactgroups = contactgroup.contacts.length;
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h4>{contactgroup.name}</h4>
              <p className="text-muted">
                <FormattedMessage
                  id="alarmgroups_app.number_of_contactgroups"
                  defaultMessage={`{numberOfContactgroups, number} {numberOfContactgroups, plural, 
                one {recipient}
                other {recipients}}`}
                  values={{ numberOfContactgroups }}
                />
              </p>
            </div>
          </div>

          <ActionBar
            // doDeleteContactsById={doDeleteContactsById}
            showGroupMessageModal={this.showGroupMessageModal}
          />

          <table className={`${tableStyles.Table} ${tableStyles.Responsive}`}>
            <thead style={{ backgroundColor: "#D8D8D8" }}>
              <tr className="text-muted">
                <td>
                  <FormattedMessage
                    id="alarmgroups_app.email_address"
                    defaultMessage="E-mail address"
                  />
                </td>
                <td>
                  <FormattedMessage
                    id="alarmgroups_app.phone_number"
                    defaultMessage="Phone number"
                  />
                </td>
                <td>
                  {" "}
                  <FormattedMessage
                    id="alarmgroups_app.first_name"
                    defaultMessage="First name"
                  />
                </td>
                <td>
                  {" "}
                  <FormattedMessage
                    id="alarmgroups_app.last_name"
                    defaultMessage="Last name"
                  />
                </td>
                <td>&nbsp;</td>
              </tr>
            </thead>
            <tbody>
              {contactgroup.contacts.map((contact, i) => {
                const email = contact.user ? contact.user.email : contact.email;
                return (
                  <tr key={i}>
                    <td>{email || "-"}</td>
                    <td>{contact.phone_number || "-"}</td>
                    <td>{contact.first_name || "-"}</td>
                    <td>{contact.last_name || "-"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          this.handleRemoveContactFromGroup(contact)}
                        className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Danger2} ${gridStyles.FloatRight}`}
                      >
                        <FormattedMessage
                          id="alarmgroups_app.remove_from_group"
                          defaultMessage="Remove from group"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {showGroupMessageModal ? (
            <GroupMessage
              groupId={contactgroup.id}
              handleClose={() =>
                this.setState({ showGroupMessageModal: false })}
            />
          ) : null}
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
