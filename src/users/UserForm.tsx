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
  currentUser?: any
};

const UserForm: React.FC<Props & DispatchProps & RouteComponentProps> = (props) => {
  const { currentUser } = props;
  const selectedOrganisationUuid = useSelector(getSelectedOrganisation).uuid;
  const baseUrl = `/api/v4/organisations/${selectedOrganisationUuid}/users/`;

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialValues = currentUser ? {
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    username: currentUser.username,
    email: currentUser.email,
    roles: currentUser.roles,
  } : {
    email: null,
    roles: ['user'] // give user role to new user by default
  };

  const onSubmit = (values: Values) => {
    if (!currentUser) {
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
      fetch(`/api/v4/organisations/${selectedOrganisationUuid}/users/${currentUser.id}/`, {
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
      backUrl={"/users"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {currentUser ? (
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
          title={currentUser ? 'Email' : 'Email *'}
          name={'email'}
          value={values.email}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={currentUser || !emailValidator(values.email)}
          errorMessage={emailValidator(values.email)}
          triedToSubmit={triedToSubmit}
          readOnly={currentUser}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <UserRoles
          title={currentUser ? 'Roles' : 'Roles *'}
          name={'roles'}
          value={values.roles}
          valueChanged={value => handleValueChange('roles', value)}
          currentUser={currentUser}
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
            {currentUser ? (
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
      {currentUser && showDeleteModal ? (
        <DeleteModal
          rows={[currentUser]}
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