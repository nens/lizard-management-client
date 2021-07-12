import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { UserRoles } from '../form/UserRoles';
import { TextInput } from './../form/TextInput';
import { SubmitButton } from '../form/SubmitButton';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
import { addNotification } from '../actions';
import { getSelectedOrganisation } from '../reducers';
import { emailValidator } from '../form/validators';
import { userFormHelpText } from '../utils/help_texts/helpTextForUsers';
import { fetchWithOptions } from '../utils/fetchWithOptions';
import FormActionButtons from '../components/FormActionButtons';
import DeleteModal from '../components/DeleteModal';
import formStyles from './../styles/Forms.module.css';
import userManagementIcon from "../images/userManagement.svg";

interface Props {
  currentRecord?: any
};

const UserForm: React.FC<Props & DispatchProps & RouteComponentProps> = (props) => {
  const { currentRecord } = props;
  const selectedOrganisationUuid = useSelector(getSelectedOrganisation).uuid;
  const baseUrl = `/api/v4/organisations/${selectedOrganisationUuid}/users/`;

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialValues = currentRecord ? {
    firstName: currentRecord.first_name,
    lastName: currentRecord.last_name,
    username: currentRecord.username,
    email: currentRecord.email,
    roles: currentRecord.roles,
  } : {
    email: null,
    roles: ['user'] // give user role to new user by default
  };

  const onSubmit = (values: Values) => {
    if (!currentRecord) {
      fetch(`/api/v4/invitations/`, {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          permissions: {
            organisation: `/api/v4/organisations/${selectedOrganisationUuid}/`,
            roles: values.roles
          }
        })
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification(`Success! An invitation email was sent to ${values.email}`, 2000);
          props.history.push("/users");
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
      fetch(`/api/v4/organisations/${selectedOrganisationUuid}/users/${currentRecord.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roles: values.roles
        })
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! User role updated', 2000);
          props.history.push("/users");
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        }
      })
      .catch(console.error);
    };
  };

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    handleSubmit,
    handleReset,
    clearInput,
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={userManagementIcon}
      imgAltDescription={"User icon"}
      headerText={"Users"}
      explanationText={userFormHelpText[fieldOnFocus] || userFormHelpText['default']}
      backUrl={"/management/users"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {currentRecord ? (
          <>
            <TextInput
              title={'First name'}
              name={'firstName'}
              value={values.firstName}
              valueChanged={handleInputChange}
              clearInput={clearInput}
              validated
              readOnly
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <TextInput
              title={'Last name'}
              name={'lastName'}
              value={values.lastName}
              valueChanged={handleInputChange}
              clearInput={clearInput}
              validated
              readOnly
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <TextInput
              title={'Username'}
              name={'username'}
              value={values.username}
              valueChanged={handleInputChange}
              clearInput={clearInput}
              validated
              readOnly
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </>
        ) : null}
        <TextInput
          title={currentRecord ? 'Email' : 'Email *'}
          name={'email'}
          value={values.email}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={currentRecord || !emailValidator(values.email)}
          errorMessage={emailValidator(values.email)}
          triedToSubmit={triedToSubmit}
          readOnly={currentRecord}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <UserRoles
          title={currentRecord ? 'Roles' : 'Roles *'}
          name={'roles'}
          value={values.roles}
          valueChanged={value => handleValueChange('roles', value)}
          currentUser={currentRecord}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/users'}
          />
          <div style={{
            display: "flex"
          }}>
            {currentRecord ? (
              <div style={{marginRight: "16px"}}>
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Deactivate",
                      actionFunction: () => {setShowDeleteModal(true)}
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
          displayContent={[{name: "username", width: 40}, {name: "email", width: 60}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={'/users'}
          text={'You are deactivating the following user. Please make sure that s/he is not a member of any other organisation before continue.'}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(withRouter(UserForm));