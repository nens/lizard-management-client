import React from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { TextInput } from './../form/TextInput';
import { SubmitButton } from '../form/SubmitButton';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
import { addNotification } from '../actions';
import { getSelectedOrganisation } from '../reducers';
import formStyles from './../styles/Forms.module.css';
import userManagementIcon from "../images/userManagement.svg";

interface Props {
  currentUser?: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};

const GroupForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentUser } = props;
  const selectedOrganisationUuid = useSelector(getSelectedOrganisation).uuid;

  const initialValues = currentUser ? {
    username: currentUser.username,
    email: currentUser.email
  } : {
    username: null,
    email: null
  };

  const onSubmit = (values: Values) => {
    const body = {
      username: values.username,
      email: values.email
    };

    if (!currentUser) {
      fetch("/api/v4/contactgroups/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          organisation: selectedOrganisationUuid
        })
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New group created', 2000);
          props.history.push("/alarms/groups");
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
      fetch(`/api/v4/contactgroups/${currentUser.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! Group updated', 2000);
          props.history.push("/alarms/groups");
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
    // handleValueChange,
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
        <TextInput
          title={'Username'}
          name={'username'}
          value={values.username}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Email'}
          name={'email'}
          value={values.email}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
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

export default connect(null, mapPropsToDispatch)(withRouter(GroupForm));