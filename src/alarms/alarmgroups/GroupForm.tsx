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
import { SelectDropdown, Value } from '../../form/SelectDropdown';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { groupFormHelpText } from '../../utils/help_texts/helpTextForAlarmGroups';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { usePaginatedFetch } from '../../utils/usePaginatedFetch';
import { baseUrl } from './GroupTable';
import DeleteModal from '../../components/DeleteModal';
import FormActionButtons from '../../components/FormActionButtons';
import GroupMessage from './GroupMessage';
import formStyles from './../../styles/Forms.module.css';
import groupIcon from "../../images/group.svg";

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
    contacts: currentGroup.contacts.map((contact: any) => convertToSelectObject(contact.id, contact.first_name + ' ' + contact.last_name))
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
  const { results, fetchingState } = usePaginatedFetch({
    url: `/api/v4/contacts/?organisation__uuid=${currentGroup ? currentGroup.organisation.uuid : selectedOrganisationUuid}`
  });
  useEffect(() => {
    setContacts(results && results.map((contact: any) => convertToSelectObject(contact.id, contact.first_name + ' ' + contact.last_name, contact.email, contact.phone_number)));
  }, [results]);

  // Modal to send message to all contacts in group
  const [showGroupMessageModal, setShowGroupMessageModal] = useState<boolean>(false);
  // Modal to delete the selected group
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

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
      imgUrl={groupIcon}
      imgAltDescription={"Group icon"}
      headerText={"Groups"}
      explanationText={groupFormHelpText[fieldOnFocus] || groupFormHelpText['default']}
      backUrl={"/alarms/groups"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'Name *'}
          name={'name'}
          placeholder={'Please enter at least 1 character'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.name)}
          errorMessage={minLength(1, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
          isLoading={fetchingState === 'FETCHING'}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/alarms/groups'}
          />
          <div style={{
            display: "flex"
          }}>
            {currentGroup ? (
              <div style={{marginRight: "16px"}}>
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true)
                    },
                    {
                      displayValue: "Send message",
                      actionFunction: () => setShowGroupMessageModal(true)
                    }
                  ]}
                />
              </div>
            ) : null}
            <SubmitButton
              onClick={tryToSubmitForm}
            />
          </div>
        </div>
        {showGroupMessageModal ? (
          <GroupMessage
            groupId={currentGroup.id}
            handleClose={() => setShowGroupMessageModal(false)}
          />
        ) :null}
        {currentGroup && showDeleteModal ? (
          <DeleteModal
            rows={[currentGroup]}
            displayContent={[{name: "name", width: 30}, {name: "id", width: 70}]}
            fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
            handleClose={() => setShowDeleteModal(false)}
            tableUrl={'/alarms/groups'}
          />
        ) : null}
      </form>
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapPropsToDispatch)(withRouter(GroupForm));