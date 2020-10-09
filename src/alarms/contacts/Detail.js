import buttonStyles from "../../styles/Buttons.module.css";
import formStyles from "../../styles/Forms.module.css";
import gridStyles from "../../styles/Grid.module.css";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import styles from "./Detail.module.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: null,
      isFetching: true,
      submitActive: false
    };
    this.fetchContactDetails = this.fetchContactDetails.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.updatePhoneNumber = this.updatePhoneNumber.bind(this);
    this.handleUpdateContact = this.handleUpdateContact.bind(this);
  }

  updateFirstName(newValue) {
    const { contact } = this.state;

    if (contact.user) {
      contact.user.first_name = newValue;
    } else {
      contact.first_name = newValue;
    }
    this.setState({
      contact
    });
  }
  updateLastName(newValue) {
    const { contact } = this.state;

    if (contact.user) {
      contact.user.last_name = newValue;
    } else {
      contact.last_name = newValue;
    }
    this.setState({
      contact
    });
  }
  updateEmail(newValue) {
    const { contact } = this.state;

    if (contact.user) {
      contact.user.email = newValue;
    } else {
      contact.email = newValue;
    }
    this.setState({
      contact
    });
  }
  updatePhoneNumber(newValue) {
    const { contact } = this.state;

    if (contact.user) {
      contact.user.phone_number = newValue;
    } else {
      contact.phone_number = newValue;
    }
    this.setState({
      contact
    });
  }

  handleUpdateContact() {
    const { contact } = this.state;
    const { match, addNotification, selectedOrganisation } = this.props;

    if (contact.user) {
      fetch(`/api/v3/contacts/${match.params.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: contact.user.username
        })
      })
        .then(response => response.json())
        .then(data => {
          addNotification(`Contact updated`, 2000);
        });
    } else {
      fetch(`/api/v3/contacts/${match.params.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organisation: selectedOrganisation.uuid,
          first_name: contact.first_name || "",
          last_name: contact.last_name || "",
          id: match.params.id,
          phone_number: contact.phone_number || "",
          email: contact.email || "",
          user: null
        })
      })
        .then(response => response.json())
        .then(data => {
          addNotification(`Contact updated`, 2000);
        });
    }
  }

  componentDidMount() {
    const { match } = this.props;
    this.fetchContactDetails(match.params.id);
  }

  fetchContactDetails(contactId) {
    fetch(`/api/v3/contacts/${contactId}/`, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(contact => {
        this.setState({
          contact: contact,
          isFetching: false
        });
      });
  }

  render() {
    const { isFetching, contact } = this.state;

    if (isFetching) {
      return (
        <div className={styles.LoadingIndicator}>
          <MDSpinner size={24} />
        </div>
      );
    }

    if (contact.user) {
      return (
        <div className={gridStyles.Container}>
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="text"
                  id="firstName"
                  value={contact.user.first_name}
                  onChange={e => this.updateFirstName(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.first_name_1"
                    defaultMessage="First name"
                  />
                </small>
              </div>
            </div>
            <div
              className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="text"
                  id="lastName"
                  value={contact.user.last_name}
                  onChange={e => this.updateLastName(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.last_name_1"
                    defaultMessage="Last name"
                  />
                </small>
              </div>
            </div>
          </div>

          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="email"
                  id="email"
                  value={contact.user.email}
                  onChange={e => this.updateEmail(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.email_address_1"
                    defaultMessage="E-mail address"
                  />
                </small>
              </div>
            </div>
          </div>

          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="tel"
                  id="phoneNumber"
                  value={contact.user.phone_number}
                  onChange={e => this.updatePhoneNumber(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.phone_number_1"
                    defaultMessage="Phone number"
                  />
                </small>
              </div>
            </div>
          </div>

          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <button
                type="button"
                className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                onClick={this.handleUpdateContact}
                disabled={this.state.submitActive ? true : false}
              >
                <FormattedMessage
                  id="contacts_new.update_contact"
                  defaultMessage="Update contact"
                />
                <Ink />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (contact) {
      return (
        <div className={gridStyles.Container}>
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="text"
                  id="firstName"
                  value={contact.first_name}
                  onChange={e => this.updateFirstName(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.first_name_2"
                    defaultMessage="First name"
                  />
                </small>
              </div>
            </div>
            <div
              className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="text"
                  id="lastName"
                  value={contact.last_name}
                  onChange={e => this.updateLastName(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.last_name_2"
                    defaultMessage="Last name"
                  />
                </small>
              </div>
            </div>
          </div>

          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="email"
                  id="email"
                  value={contact.email}
                  onChange={e => this.updateEmail(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.email_address_2"
                    defaultMessage="E-mail address"
                  />
                </small>
              </div>
            </div>
          </div>

          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div className={formStyles.FormGroup}>
                <input
                  className={formStyles.FormControl}
                  type="tel"
                  id="phoneNumber"
                  value={contact.phone_number}
                  onChange={e => this.updatePhoneNumber(e.target.value)}
                  placeholder=""
                  maxLength={80}
                />
                <small id="firstName" className="form-text text-muted">
                  <FormattedMessage
                    id="contacts_app.phone_number_2"
                    defaultMessage="Phone number"
                  />
                </small>
              </div>
            </div>
          </div>

          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <button
                type="button"
                className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                onClick={this.handleUpdateContact}
                disabled={this.state.submitActive ? true : false}
              >
                <FormattedMessage
                  id="contacts_new.update_contact"
                  defaultMessage="Update contact"
                />
                <Ink />
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
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

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
