import React from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { TextInput } from './../form/TextInput';
import { SelectDropdown } from '../form/SelectDropdown';
import { SubmitButton } from '../form/SubmitButton';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
import { addNotification } from '../actions';
import { getSelectedOrganisation } from '../reducers';
import { convertToSelectObject } from '../utils/convertToSelectObject';
import formStyles from './../styles/Forms.module.css';
import userManagementIcon from "../images/userManagement.svg";

interface Props {
  currentUser?: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};

const UserForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentUser } = props;
  const selectedOrganisationUuid = useSelector(getSelectedOrganisation).uuid;
  const availableRoles = ['admin', 'user', 'supplier', 'manager'].map(role => convertToSelectObject(role));

  const initialValues = currentUser ? {
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    username: currentUser.username,
    email: currentUser.email,
    roles: currentUser.roles.map((role: any) => convertToSelectObject(role)),
  } : {
    email: null,
    roles: []
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
            roles: values.roles.map((role: any) => role.value)
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
          roles: values.roles.map((role: any) => role.value)
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
    // triedToSubmit,
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
      imgAltDescription={"Group icon"}
      headerText={"Groups"}
      explanationText={'User form'}
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
          title={'Email'}
          name={'email'}
          value={values.email}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly={currentUser}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={'Roles'}
          name={'roles'}
          placeholder={'- Select -'}
          value={values.roles}
          valueChanged={value => handleValueChange('roles', value)}
          options={availableRoles}
          validated
          isMulti
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/users'}
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

export default connect(null, mapPropsToDispatch)(withRouter(UserForm));