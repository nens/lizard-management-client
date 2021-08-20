import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { TextInput } from './../form/TextInput';
import { CheckBox } from './../form/CheckBox';
import { SubmitButton } from '../form/SubmitButton';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
import { minLength } from '../form/validators';
import { addNotification } from '../actions';
import { personalApiKeysFormHelpText } from '../utils/help_texts/helpTextForPersonalAPIKeys';
import { fetchWithOptions } from '../utils/fetchWithOptions';
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';
import FormActionButtons from '../components/FormActionButtons';
import styles from './PersonalApiKeyForm.module.css';
import formStyles from './../styles/Forms.module.css';
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";


export const ContractForm = () => {

  const initialValues = {
  };

  const onSubmit = (values: Values) => {};

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    handleValueChange,
    tryToSubmitForm,
    handleInputChange,
    fieldOnFocus,
    handleFocus,
    handleBlur,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={personalApiKeysIcon}
      imgAltDescription={"Personal API keys icon"}
      headerText={"Personal API keys"}
      explanationText={personalApiKeysFormHelpText[fieldOnFocus] || personalApiKeysFormHelpText['default']}
      backUrl={"/management/personal_api_keys"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <span className={`${formStyles.FormFieldTitle} ${formStyles.FirstFormFieldTitle}`}>
          1: General
        </span>
        <TextInput
          title={'Name *'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(2, values.name)}
          errorMessage={minLength(2, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <span className={formStyles.FormFieldTitle}>
          2. Scope
        </span>
        <CheckBox
          title={'Read / Write'}
          name={'scopeWildcardReadWrite'}
          value={values.scopeWildcardReadWrite}
          valueChanged={bool => handleValueChange('scopeWildcardReadWrite', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
          validated={values.scopeWildcardReadWrite === true || values.scopeFtpReadWrite === true }
          errorMessage={(values.scopeWildcardReadWrite === true || values.scopeFtpReadWrite === true)? false : "Chose at least 1 scope: read/ write or FTP"}
        />
        
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/personal_api_keys'}
          />
          
        </div>
      </form>
    </ExplainSideColumn>
  );
};