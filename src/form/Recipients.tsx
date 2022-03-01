import React, { useState } from "react";
import { SelectDropdown, Value } from "./SelectDropdown";
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";

export interface Recipient {
  contact_group: Value;
  message: Value;
}

export interface NewRecipient {
  contact_group: Value | null;
  message: Value | null;
}

interface MyProps {
  title: string;
  name: string;
  organisation: string;
  recipients: Recipient[];
  availableGroups: Value[];
  availableTemplates: Value[];
  valueChanged: (recipients: Recipient[]) => void;
  valueRemoved: (recipients: Recipient[]) => void;
  clearInput?: (name: string) => void;
  validated: boolean;
  errorMessage?: string | false;
  placeholder?: string;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement | HTMLButtonElement>) => void;
  onBlur?: () => void;
  triedToSubmit?: boolean;
  readOnly?: boolean;
}

export function Recipients(props: MyProps) {
  const {
    title,
    name,
    recipients,
    availableGroups,
    availableTemplates,
    valueChanged,
    valueRemoved,
    onFocus,
    onBlur,
    triedToSubmit,
    readOnly,
  } = props;

  const [recipient, setRecipient] = useState<NewRecipient>({
    contact_group: null,
    message: null,
  });

  return (
    <label htmlFor={name} className={formStyles.Label}>
      <span className={formStyles.LabelTitle}>{title}</span>
      <div className={formStyles.GridContainer}>
        <div className={formStyles.SecondLabel}>Group</div>
        <div className={formStyles.SecondLabel}>Template message</div>
        <div />
        {recipients.map((recipient, i) => (
          <React.Fragment key={i}>
            <SelectDropdown
              title={""}
              id={"contactGroup"}
              name={"contactGroup" + i}
              value={recipient.contact_group}
              valueChanged={(value) => {
                const newRecipientList = recipients.map((re, idx) => {
                  if (idx === i) {
                    return {
                      ...re,
                      contact_group: value as Value,
                    };
                  }
                  return re;
                });
                valueChanged(newRecipientList);
              }}
              options={availableGroups}
              validated={!!recipient.contact_group.value}
              errorMessage={"Please select a group"}
              triedToSubmit={triedToSubmit}
              dropUp
              isClearable={false}
              readOnly={readOnly}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <SelectDropdown
              title={""}
              id={"message"}
              name={"message" + i}
              value={recipient.message}
              valueChanged={(value) => {
                const newRecipientList = recipients.map((re, idx) => {
                  if (idx === i) {
                    return {
                      ...re,
                      message: value as Value,
                    };
                  }
                  return re;
                });
                valueChanged(newRecipientList);
              }}
              options={availableTemplates}
              validated={!!recipient.message.value}
              errorMessage={"Please select a template"}
              triedToSubmit={triedToSubmit}
              dropUp
              isClearable={false}
              readOnly={readOnly}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Link}`}
              onClick={(e) => {
                e.preventDefault();
                valueRemoved(recipients.filter((_, idx) => idx !== i));
              }}
              style={{
                marginBottom: 24,
              }}
            >
              REMOVE
            </button>
          </React.Fragment>
        ))}
        <SelectDropdown
          title={""}
          id={"contactGroup"}
          name={"newContactGroup"}
          value={recipient.contact_group}
          valueChanged={(value) => {
            setRecipient({
              ...recipient,
              contact_group: (value as Value) || null,
            });
          }}
          options={availableGroups}
          validated
          dropUp
          readOnly={readOnly}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <SelectDropdown
          title={""}
          id={"message"}
          name={"newMessage"}
          value={recipient.message}
          valueChanged={(value) => {
            setRecipient({
              ...recipient,
              message: (value as Value) || null,
            });
          }}
          options={availableTemplates}
          validated
          dropUp
          readOnly={readOnly}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <div />
        <button
          id={"addRecipient"}
          className={buttonStyles.NewButton}
          onClick={(e) => {
            e.preventDefault();
            if (recipient.contact_group && recipient.message) {
              valueChanged([...recipients, recipient as Recipient]);
            }
            setRecipient({
              contact_group: null,
              message: null,
            });
          }}
          title={
            !recipient.contact_group || !recipient.message
              ? "Please select a group and a message for the new recipient"
              : undefined
          }
          disabled={!recipient.contact_group || !recipient.message}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          Add recipient
        </button>
      </div>
    </label>
  );
}
