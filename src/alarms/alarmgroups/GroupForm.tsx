import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ExplainSideColumn } from "../../components/ExplainSideColumn";
import { TextInput } from "./../../form/TextInput";
import { SubmitButton } from "../../form/SubmitButton";
import { CancelButton } from "../../form/CancelButton";
import { useForm, Values } from "../../form/useForm";
import { minLength } from "../../form/validators";
import { addNotification } from "../../actions";
import { getSelectedOrganisation } from "../../reducers";
import { SelectDropdown, Value } from "../../form/SelectDropdown";
import { convertToSelectObject } from "../../utils/convertToSelectObject";
import { groupFormHelpText } from "../../utils/help_texts/helpTextForAlarmGroups";
import { fetchWithOptions } from "../../utils/fetchWithOptions";
import { useRecursiveFetch } from "../../api/hooks";
import { baseUrl } from "./GroupTable";
import { AppDispatch } from "../..";
import { ContactGroup } from "../../types/contactGroupType";
import DeleteModal from "../../components/DeleteModal";
import FormActionButtons from "../../components/FormActionButtons";
import GroupMessage from "./GroupMessage";
import formStyles from "./../../styles/Forms.module.css";
import groupIcon from "../../images/group.svg";

interface Props {
  currentRecord?: ContactGroup;
}
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void;
}

const GroupForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentRecord } = props;
  const selectedOrganisationUuid = useSelector(getSelectedOrganisation).uuid;

  const initialValues = currentRecord
    ? {
        name: currentRecord.name,
        contacts: currentRecord.contacts.map((contact) =>
          convertToSelectObject(contact.id, contact.first_name + " " + contact.last_name)
        ),
      }
    : {
        name: null,
        contacts: [],
      };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      contacts: values.contacts.map((contact: Value) => contact.value),
    };

    if (!currentRecord) {
      fetch("/api/v4/contactgroups/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          organisation: selectedOrganisationUuid,
        }),
      })
        .then((response) => {
          const status = response.status;
          if (status === 201) {
            props.addNotification("Success! New group created", 2000);
            props.history.push("/management/alarms/groups");
          } else if (status === 403) {
            props.addNotification("Not authorized", 2000);
            console.error(response);
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error);
    } else {
      fetch(`/api/v4/contactgroups/${currentRecord.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          const status = response.status;
          if (status === 200) {
            props.addNotification("Success! Group updated", 2000);
            props.history.push("/management/alarms/groups");
          } else {
            props.addNotification(status, 2000);
            console.error(response);
          }
        })
        .catch(console.error);
    }
  };

  // Fetch list of contacts to add to group
  const { data: contacts, isFetching: contactsIsFetching } = useRecursiveFetch(
    "/api/v4/contacts/",
    {
      organisation__uuid: currentRecord
        ? currentRecord.organisation.uuid
        : selectedOrganisationUuid,
    }
  );

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
  } = useForm({ initialValues, onSubmit });

  return (
    <ExplainSideColumn
      imgUrl={groupIcon}
      imgAltDescription={"Group icon"}
      headerText={"Groups"}
      explanationText={groupFormHelpText[fieldOnFocus] || groupFormHelpText["default"]}
      backUrl={"/management/alarms/groups"}
      fieldName={fieldOnFocus}
    >
      <form className={formStyles.Form} onSubmit={handleSubmit} onReset={handleReset}>
        <TextInput
          title={"Name *"}
          name={"name"}
          placeholder={"Please enter at least 1 character"}
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
          title={"Contacts"}
          name={"contacts"}
          placeholder={"- Search and select -"}
          value={values.contacts}
          valueChanged={(value) => handleValueChange("contacts", value)}
          options={
            contacts
              ? contacts.map((contact) =>
                  convertToSelectObject(
                    contact.id,
                    contact.first_name + " " + contact.last_name,
                    contact.email,
                    contact.phone_number
                  )
                )
              : []
          }
          validated
          isMulti
          isLoading={contactsIsFetching}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div className={formStyles.ButtonContainer}>
          <CancelButton url={"/management/alarms/groups"} />
          <div
            style={{
              display: "flex",
            }}
          >
            {currentRecord ? (
              <div style={{ marginRight: "16px" }}>
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true),
                    },
                    {
                      displayValue: "Send message",
                      actionFunction: () => setShowGroupMessageModal(true),
                    },
                  ]}
                />
              </div>
            ) : null}
            <SubmitButton onClick={tryToSubmitForm} />
          </div>
        </div>
        {showGroupMessageModal ? (
          <GroupMessage
            groupId={currentRecord?.id}
            handleClose={() => setShowGroupMessageModal(false)}
          />
        ) : null}
        {currentRecord && showDeleteModal ? (
          <DeleteModal
            rows={[currentRecord]}
            displayContent={[
              { name: "name", width: 30 },
              { name: "id", width: 70 },
            ]}
            fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
            handleClose={() => setShowDeleteModal(false)}
            tableUrl={"/management/alarms/groups"}
          />
        ) : null}
      </form>
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: AppDispatch) => ({
  addNotification: (message: string | number, timeout: number) =>
    dispatch(addNotification(message, timeout)),
});

export default connect(null, mapPropsToDispatch)(withRouter(GroupForm));
