import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../reducers';
import { SelectDropdown, Value } from './SelectDropdown';
import formStyles from "../styles/Forms.module.css";
import { convertToSelectObject } from '../utils/convertToSelectObject';
import { getUuidFromUrl } from '../utils/getUuidFromUrl';

interface Message {
  contact_group: string, // url
  message: string // url
}

interface Recipient {
  contact_group: Value,
  message: Value
};

interface MyProps {
  title: string,
  name: string,
  messages: Message[],
  valueChanged: (recipients: Recipient[]) => void,
  valueRemoved: (recipients: Recipient[]) => void,
  clearInput?: (name: string) => void,
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export function Recipients (props: MyProps) {
  const {
    title,
    name,
    messages,
    valueChanged,
    valueRemoved,
    // onFocus,
    // onBlur,
    // validated,
    // errorMessage,
    // triedToSubmit,
    // readOnly
  } = props;

  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const [availableGroups, setAvailableGroups] = useState<Value[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<Value[]>([]);

  useEffect(() => {
    // Fetch list of available contact groups when component first mounted
    fetch(`/api/v4/contactgroups/?organisation__uuid=${selectedOrganisation.uuid}&page_size=1000`, {
      credentials: 'same-origin'
    }).then(
      response => response.json()
    ).then(data => {
      setAvailableGroups(data.results.map((group: any) => convertToSelectObject(group.id, group.name)));
    }).catch(console.error);


    // Fetch list of available templates when component first mounted
    fetch(`/api/v4/messages/?organisation__uuid=${selectedOrganisation.uuid}&page_size=1000`, {
      credentials: 'same-origin'
    }).then(
      response => response.json()
    ).then(data => {
      setAvailableTemplates(data.results.map((message: any) => convertToSelectObject(message.id, message.name)));
    }).catch(console.error);
  }, [selectedOrganisation]);

  const [recipients, setRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    const listOfRecipients = messages.map(message => {
      const groupId = parseInt(getUuidFromUrl(message.contact_group));
      const templateId = parseInt(getUuidFromUrl(message.message));

      const selectedGroup = availableGroups.find(group => group.value === groupId);
      const groupName = selectedGroup ? selectedGroup.label : '';

      const selectedTemplate = availableTemplates.find(template => template.value === templateId);
      const templateName = selectedTemplate ? selectedTemplate.label : '';
      
      return {
        contact_group: convertToSelectObject(groupId, groupName),
        message: convertToSelectObject(templateId, templateName)
      };
    });
    setRecipients(listOfRecipients);
  }, [messages, availableGroups, availableTemplates]);

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '50% 50%',
          columnGap: 10
        }}
      >
        <div>Group</div>
        <div>Template message</div>
        {recipients.map((recipient, i) => (
          <React.Fragment key={i}>
            <SelectDropdown
              title={''}
              name={'contactGroup' + i}
              value={recipient.contact_group}
              valueChanged={value => {
                setRecipients(recipients.map((re, idx) => {
                  if (idx === i) {
                    return {
                      ...re,
                      contact_group: value as Value
                    };
                  };
                  return re;
                }))
              }}
              options={availableGroups}
              validated
              dropUp
              isClearable={false}
            />
            <SelectDropdown
              title={''}
              name={'message' + i}
              value={recipient.message}
              valueChanged={value => {
                setRecipients(recipients.map((re, idx) => {
                  if (idx === i) {
                    return {
                      ...re,
                      message: value as Value
                    };
                  };
                  return re;
                }))
              }}
              options={availableTemplates}
              validated
              dropUp
              isClearable={false}
            />
          </React.Fragment>
        ))}
        <button
          onClick={e => {
            e.preventDefault();
            setRecipients([
              ...recipients,
              {
                contact_group: convertToSelectObject(''),
                message: convertToSelectObject('')
              }
            ]);
          }}
        >
          Add recipient
        </button>
      </div>
    </label>
  );
};