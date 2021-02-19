import React from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { emailValidator, minLength, phoneNumberValidator } from '../../form/validators';
import { addNotification } from '../../actions';
import { getSelectedOrganisation } from '../../reducers';
import formStyles from './../../styles/Forms.module.css';
import contactIcon from "../../images/contacts@3x.svg";

interface Props {
  currentContact?: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};

const ContactForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentContact } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const initialValues = currentContact ? {
    firstName: currentContact.user ? currentContact.user.first_name : currentContact.first_name,
    lastName: currentContact.user ? currentContact.user.last_name : currentContact.last_name,
    email: currentContact.user ? currentContact.user.email : currentContact.email,
    phoneNumber: currentContact.user ? currentContact.user.phone_number : currentContact.phone_number,
  } : {
    firstName: null,
    lastName: null,
    email: null,
    phoneNumber: null
  };

  const onSubmit = (values: Values) => {
    const body = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone_number: values.phoneNumber,
      organisation: selectedOrganisation.uuid
    };

    if (!currentContact) {
      fetch("/api/v4/contacts/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New contact created', 2000);
          props.history.push("/alarms/contacts");
        } else if (status === 403) {
          props.addNotification("Not authorized", 2000);
          console.error(response);
        } else {
          props.addNotification(status, 2000);
          console.error(response)
        };
      })
      .catch(console.error)
    } else {
      if (currentContact.user) {
        fetch(`/api/v4/contacts/${currentContact.id}/`, {
          credentials: "same-origin",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: body
          })
        })
        .then(response => {
          const status = response.status;
          if (status === 200) {
            props.addNotification('Success! Contact updated', 2000);
            props.history.push("/alarms/contacts");
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error)
      } else {
        fetch(`/api/v4/contacts/${currentContact.id}/`, {
          credentials: "same-origin",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        })
        .then(response => {
          const status = response.status;
          if (status === 200) {
            props.addNotification('Success! Contact updated', 2000);
            props.history.push("/alarms/contacts");
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error)
      }
    }
  }

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
    // fieldOnFocus,
    // handleBlur,
    // handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={contactIcon}
      imgAltDescription={"Contact icon"}
      headerText={"Contacts"}
      explanationText={"Your contacts contain an email address, phone number and a name. Add these contacts to group to send them alarm messages when your thresholds are triggered."}
      backUrl={"/alarms/contacts"}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'First name *'}
          name={'firstName'}
          value={values.firstName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.firstName)}
          errorMessage={minLength(1, values.firstName)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Last name *'}
          name={'lastName'}
          value={values.lastName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.lastName)}
          errorMessage={minLength(1, values.lastName)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Email *'}
          name={'email'}
          type={'email'}
          value={values.email}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!emailValidator(values.email)}
          errorMessage={emailValidator(values.email)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Telephone number'}
          name={'phoneNumber'}
          value={values.phoneNumber}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!values.phoneNumber || !phoneNumberValidator(values.phoneNumber)}
          errorMessage={phoneNumberValidator(values.phoneNumber)}
          triedToSubmit={triedToSubmit}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/alarms/contacts'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapPropsToDispatch)(withRouter(ContactForm));