import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { addNotification } from '../../actions';
import { getSelectedOrganisation } from '../../reducers';
import formStyles from './../../styles/Forms.module.css';
import contactIcon from "../../images/contacts@3x.svg";
import { SelectDropdown, Value } from '../../form/SelectDropdown';
import { convertToSelectObject } from '../../utils/convertToSelectObject';

interface Props {
  currentGroup?: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};

const GroupForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentGroup } = props;
  const selectedOrganisationUuid = useSelector(getSelectedOrganisation).uuid;

  const initialValues = currentGroup ? {
    name: currentGroup.name,
    contacts: currentGroup.contacts.map((contact: any) => convertToSelectObject(contact.id, contact.first_name + ' ' + contact.last_name, contact.email))
  } : {
    name: null,
    contacts: []
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      contacts: values.contacts.map((contact: any) => contact.value)
    };

    if (!currentGroup) {
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
      fetch(`/api/v4/contactgroups/${currentGroup.id}/`, {
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

  // Fetch list of contacts to add to group
  const [contacts, setContacts] = useState<Value[] | null>(null);
  useEffect(() => {
    fetch(`/api/v4/contacts/?page_size=1000&organisation__uuid=${currentGroup ? currentGroup.organisation.uuid : selectedOrganisationUuid}`, {
      credentials: "same-origin"
    })
    .then(response => response.json())
    .then(data => {
      const contacts = data.results.map((contact: any) => convertToSelectObject(contact.id, contact.first_name + ' ' + contact.last_name, contact.email));
      setContacts(contacts);
    })
    .catch(console.error);
  }, [selectedOrganisationUuid, currentGroup]);

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
    // fieldOnFocus,
    // handleBlur,
    // handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={contactIcon}
      imgAltDescription={"Group icon"}
      headerText={"Groups"}
      explanationText={"Groups are made of your contacts. In this screen, you can manage them by adding or deleting contacts. You can also add or delete groups for your alarm messages."}
      backUrl={"/alarms/groups"}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'Name *'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.name)}
          errorMessage={minLength(1, values.name)}
          triedToSubmit={triedToSubmit}
        />
        <SelectDropdown
          title={'Contacts'}
          name={'contacts'}
          placeholder={'- Search and select -'}
          value={values.contacts}
          valueChanged={value => handleValueChange('contacts', value)}
          options={contacts || []}
          validated
          isMulti
          isLoading={!contacts}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/alarms/groups'}
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