import React, { Component } from "react";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import gridStyles from "../../styles/Grid.css";
import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";
import { withRouter } from "react-router-dom";

class NewContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitActive: false
    };
    this.handleClickCreateContactButton = this.handleClickCreateContactButton.bind(
      this
    );
  }
  componentDidMount() {
    try {
      document.getElementById("firstName").focus();
    } catch (e) {
      console.error("Could not focus() on input element..");
    }
  }
  validateEmail(address) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(address)) {
      return true;
    }
    return false;
  }
  handleClickCreateContactButton() {
    this.setState({
      submitActive: true
    });
    const { organisation, history } = this.props;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      this.validateEmail(email) &&
      phoneNumber.length > 0
    ) {
      fetch("/api/v3/contacts/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          organisation: organisation.unique_id
        })
      })
        .then(response => {
          if (response.status === 201) {
            return response.json();
          } else if (response.status === 403) {
            alert("Not authorized");
            return response.json();
          } else {
            alert("An error occurred while trying to create a new contact");
            return response.json();
          }
        })
        .then(data => {
          history.push("/alarms/contacts");
        });
    } else {
      alert("Please provide valid values in all fields!");
    }
  }
  render() {
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
                defaultValue=""
                placeholder=""
                maxLength={80}
              />
              <small id="firstName" className="form-text text-muted">
                <FormattedMessage
                  id="contacts_app.first_name_3"
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
                defaultValue=""
                placeholder=""
                maxLength={80}
              />
              <small id="firstName" className="form-text text-muted">
                <FormattedMessage
                  id="contacts_app.last_name_3"
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
                defaultValue=""
                placeholder=""
                maxLength={80}
              />
              <small id="firstName" className="form-text text-muted">
                <FormattedMessage
                  id="contacts_app.email_address_3"
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
                defaultValue=""
                placeholder=""
                maxLength={80}
              />
              <small id="firstName" className="form-text text-muted">
                <FormattedMessage
                  id="contacts_app.phone_number_3"
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
              onClick={this.handleClickCreateContactButton}
              disabled={this.state.submitActive ? true : false}
            >
              <FormattedMessage
                id="contacts_new.create_contact"
                defaultMessage="Create contact"
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
    organisation: state.organisations.selected
  };
};

const App = withRouter(connect(mapStateToProps, null)(NewContact));

export { App };
