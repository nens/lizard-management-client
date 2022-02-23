import { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { emailValidator, maxLength, minLength, phoneNumberValidator } from '../../form/validators';
import { addNotification } from '../../actions';
import { getSelectedOrganisation } from '../../reducers';
import { contactFormHelpText } from '../../utils/help_texts/helpTextForAlarmContacts';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { baseUrl } from './ContactTable';
import { AppDispatch } from '../..';
import { Contact } from '../../types/contactGroupType';
import FormActionButtons from '../../components/FormActionButtons';
import DeleteModal from '../../components/DeleteModal';
import formStyles from './../../styles/Forms.module.css';
import contactIcon from "../../images/contacts@3x.svg";

interface Props {
  currentRecord?: Contact
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};

const ContactForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentRecord } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const initialValues = currentRecord ? {
    // if currentRecord.user is not null, that means a Django User is linked to this contact
    // then show the infos of the Django User, otherwise show the current contact
    firstName: currentRecord.user ? currentRecord.user.first_name : currentRecord.first_name,
    lastName: currentRecord.user ? currentRecord.user.last_name : currentRecord.last_name,
    email: currentRecord.user ? currentRecord.user.email : currentRecord.email,
    phoneNumber: currentRecord.user ? currentRecord.user.phone_number : currentRecord.phone_number,
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
      phone_number: values.phoneNumber
    };

    if (!currentRecord) {
      fetch("/api/v4/contacts/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          organisation: selectedOrganisation.uuid
        })
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New contact created', 2000);
          props.history.push("/management/alarms/contacts");
        } else if (status === 403) {
          props.addNotification("Not authorized", 2000);
          console.error(response);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        };
      })
      .catch(console.error);
    } else {
      if (currentRecord.user) {
        // if currentRecord.user is not null then update the contact of the linked Django User
        fetch(`/api/v4/contacts/${currentRecord.id}/`, {
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
            props.history.push("/management/alarms/contacts");
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error);
      } else {
        fetch(`/api/v4/contacts/${currentRecord.id}/`, {
          credentials: "same-origin",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        })
        .then(response => {
          const status = response.status;
          if (status === 200) {
            props.addNotification('Success! Contact updated', 2000);
            props.history.push("/management/alarms/contacts");
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error);
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
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={contactIcon}
      imgAltDescription={"Contact icon"}
      headerText={"Contacts"}
      explanationText={contactFormHelpText[fieldOnFocus] || contactFormHelpText['default']}
      backUrl={"/management/alarms/contacts"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'First name *'}
          name={'firstName'}
          placeholder={'Please enter at least 1 character'}
          value={values.firstName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.firstName) && !maxLength(30, values.firstName)}
          errorMessage={minLength(1, values.firstName) || maxLength(30, values.firstName)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Last name *'}
          name={'lastName'}
          placeholder={'Please enter at least 1 character'}
          value={values.lastName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.lastName) && !maxLength(30, values.lastName)}
          errorMessage={minLength(1, values.lastName) || maxLength(30, values.lastName)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Email'}
          name={'email'}
          type={'email'}
          value={values.email}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!values.email || !emailValidator(values.email)}
          errorMessage={emailValidator(values.email)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/alarms/contacts'}
          />
          <div style={{display: "flex"}}>
            {currentRecord ? (
              <div style={{ marginRight: 16 }}>
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true)
                    },
                  ]} 
                />
              </div>
            ) : null}
            <SubmitButton
              onClick={tryToSubmitForm}
            />
          </div>
        </div>
      </form>
      {currentRecord && showDeleteModal ? (
        <DeleteModal
          rows={[currentRecord]}
          displayContent={[{name: "first_name", width: 20}, {name: "email", width: 50}, {name: "id", width: 30}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={'/management/alarms/contacts'}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: AppDispatch) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapPropsToDispatch)(withRouter(ContactForm));