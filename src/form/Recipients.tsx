import React, { useEffect, useState } from 'react';
import { SelectDropdown, Value } from './SelectDropdown';
import { convertToSelectObject } from '../utils/convertToSelectObject';
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

export interface Recipient {
  contact_group: Value,
  message: Value
};

export interface NewRecipient {
  contact_group: Value | null,
  message: Value | null
};

interface MyProps {
  title: string,
  name: string,
  organisation: string,
  recipients: Recipient[],
  valueChanged: (recipients: Recipient[]) => void,
  valueRemoved: (recipients: Recipient[]) => void,
  clearInput?: (name: string) => void,
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement | HTMLButtonElement>) => void,
  onBlur?: () => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export function Recipients (props: MyProps) {
  const {
    title,
    name,
    organisation,
    recipients,
    valueChanged,
    valueRemoved,
    onFocus,
    onBlur,
    triedToSubmit,
    readOnly
  } = props;

  const [availableGroups, setAvailableGroups] = useState<Value[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<Value[]>([]);
  const [recipient, setRecipient] = useState<NewRecipient>({
    contact_group: null,
    message: null
  });

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
      const listOfRecipients = recipients.map(recipient => {
        const groupId = recipient.contact_group.value;
        const templateId = recipient.message.value;

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
        {recipients.map((recipient, i) => (
          <React.Fragment key={i}>
            <SelectDropdown
              title={''}
              id={'contactGroup'}
              name={'contactGroup' + i}
              value={recipient.contact_group}
              valueChanged={value => {
                const newRecipientList = recipients.map((re, idx) => {
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
              validated={!!recipient.contact_group.value}
              errorMessage={'Please select a group'}
              triedToSubmit={triedToSubmit}
              dropUp
              isClearable={false}
              readOnly={readOnly}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <SelectDropdown
              title={''}
              id={'message'}
              name={'message' + i}
              value={recipient.message}
              valueChanged={value => {
                const newRecipientList = recipients.map((re, idx) => {
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
              validated={!!recipient.message.value}
              errorMessage={'Please select a template'}
              triedToSubmit={triedToSubmit}
              dropUp
              isClearable={false}
              readOnly={readOnly}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Link}`}
              onClick={e => {
                e.preventDefault();
                valueRemoved(recipients.filter((_, idx) => idx !== i))
              }}
            >
              REMOVE
            </button>
          </React.Fragment>
        ))}
        <SelectDropdown
          title={''}
          id={'newContactGroup'}
          name={'newContactGroup'}
          value={recipient.contact_group}
          valueChanged={value => {
            setRecipient({
              ...recipient,
              contact_group: value as Value || null
            })
          }}
          options={availableGroups}
          validated
          dropUp
        />
        <SelectDropdown
          title={''}
          id={'newMessage'}
          name={'newMessage'}
          value={recipient.message}
          valueChanged={value => {
            setRecipient({
              ...recipient,
              message: value as Value || null
            })
          }}
          options={availableTemplates}
          validated
          dropUp
        />
        <div />
        <button
          id={'addRecipient'}
          className={buttonStyles.NewButton}
          onClick={e => {
            e.preventDefault();
            if (recipient.contact_group && recipient.message) {
              valueChanged([
                ...recipients,
                recipient as Recipient
              ]);
            };
            setRecipient({
              contact_group: null,
              message: null
            });
          }}
          disabled={!recipient.contact_group || !recipient.message}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Add recipient
        </button>
      </div>
    </label>
  );
};