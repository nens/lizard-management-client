import React, { useEffect, useState } from 'react';
import { SelectDropdown, Value } from './SelectDropdown';
import { convertToSelectObject } from '../utils/convertToSelectObject';
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

export interface Message {
  contact_group: Value,
  message: Value
};

interface MyProps {
  title: string,
  name: string,
  organisation: string,
  messages: Message[],
  valueChanged: (recipients: Message[]) => void,
  valueRemoved: (recipients: Message[]) => void,
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
    organisation,
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

  const [availableGroups, setAvailableGroups] = useState<Value[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<Value[]>([]);

  // useEffect to fetch available contact groups and messages
  // and to update the list of recipients when component first mounted
  useEffect(() => {
    (async () => {
      // Fetch list of available groups
      const groupJSON = await fetch(`/api/v4/contactgroups/?organisation__uuid=${organisation}&page_size=1000`, {
        credentials: 'same-origin'
      }).then(
        response => response.json()
      );

      // Fetch list of available templates
      const templateJSON = await fetch(`/api/v4/messages/?organisation__uuid=${organisation}&page_size=1000`, {
        credentials: 'same-origin'
      }).then(
        response => response.json()
      );

      const listOfGroups: Value[] = groupJSON.results.map((group: any) => convertToSelectObject(group.id, group.name));
      const listOfTemplates: Value[] = templateJSON.results.map((template: any) => convertToSelectObject(template.id, template.name));

      setAvailableGroups(listOfGroups);
      setAvailableTemplates(listOfTemplates);

      // Update the initial list of recipients by adding group name and template name as labels
      const listOfRecipients = messages.map(message => {
        const groupId = message.contact_group.value;
        const templateId = message.message.value;

        const selectedGroup = listOfGroups.find(group => group.value === groupId);
        const groupName = selectedGroup ? selectedGroup.label : '';

        const selectedTemplate = listOfTemplates.find(template => template.value === templateId);
        const templateName = selectedTemplate ? selectedTemplate.label : '';

        return {
          contact_group: convertToSelectObject(groupId, groupName),
          message: convertToSelectObject(templateId, templateName)
        };
      });

      return valueChanged(listOfRecipients);
    })();
    // eslint-disable-next-line
  }, [organisation]); // re-fetch list of available groups and templates when selected organisation is changed for new alarm

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div className={formStyles.GridContainer}>
        <div className={formStyles.SecondLabel}>Group</div>
        <div className={formStyles.SecondLabel}>Template message</div>
        <div />
        {messages.map((recipient, i) => (
          <React.Fragment key={i}>
            <SelectDropdown
              title={''}
              name={'contactGroup' + i}
              value={recipient.contact_group}
              valueChanged={value => {
                const newRecipientList = messages.map((re, idx) => {
                  if (idx === i) {
                    return {
                      ...re,
                      contact_group: value as Value
                    };
                  };
                  return re;
                });
                valueChanged(newRecipientList);
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
                const newRecipientList = messages.map((re, idx) => {
                  if (idx === i) {
                    return {
                      ...re,
                      message: value as Value
                    };
                  };
                  return re;
                });
                valueChanged(newRecipientList);
              }}
              options={availableTemplates}
              validated
              dropUp
              isClearable={false}
            />
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Link}`}
              onClick={e => {
                e.preventDefault();
                valueRemoved(messages.filter((_, idx) => idx !== i))
              }}
            >
              REMOVE
            </button>
          </React.Fragment>
        ))}
        <button
          className={buttonStyles.NewButton}
          onClick={e => {
            e.preventDefault();
            valueChanged([
              ...messages,
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