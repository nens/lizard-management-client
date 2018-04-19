import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
// import Ink from "react-ink";
// import { FormattedMessage } from "react-intl";
import GroupMessage from "./GroupMessage";
import ActionBar from "./ActionBar";
import pluralize from "pluralize";
import { connect } from "react-redux";
import styles from "./Detail.css";
import tableStyles from "../../styles/Table.css";
import formStyles from "../../styles/Forms.css";
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
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h4>{contactgroup.name}</h4>
              <p className="text-muted">
                {contactgroup.contacts.length}{" "}
                {pluralize("recipients", contactgroup.contacts.length)}
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
                <td>&nbsp;</td>
                <td>E-mail address</td>
                <td>Phone number</td>
                <td>First name</td>
                <td>Last name</td>
              </tr>
            </thead>
            <tbody>
              {contactgroup.contacts.map((contact, i) => {
                const email = contact.user ? contact.user.email : contact.email;
                return (
                  <tr key={i}>
                    <td>
                      <input
                        type="checkbox"
                        name="contact"
                        className={formStyles.Checkbox}
                        value={contact.id}
                      />
                    </td>
                    <td>{email || "-"}</td>
                    <td>{contact.phone_number || "-"}</td>
                    <td>{contact.first_name || "-"}</td>
                    <td>{contact.last_name || "-"}</td>
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
  return {
    bootstrap: state.bootstrap
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
