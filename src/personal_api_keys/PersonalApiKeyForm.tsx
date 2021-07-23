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
import { baseUrl } from './PersonalApiKeysTable';
import Modal from '../components/Modal';
import DeleteModal from '../components/DeleteModal';
import FormActionButtons from '../components/FormActionButtons';
import styles from './PersonalApiKeyForm.module.css';
import formStyles from './../styles/Forms.module.css';
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";

interface Props {
  currentRecord?: any;
  allPersonalApiKeys?: any[];
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};
interface RouteParams {
  uuid: string;
};

const PersonalApiKeyFormModel: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord, allPersonalApiKeys } = props;
  const recordWithFtpExists = ((allPersonalApiKeys || []).filter(record=>(record.scope+'').includes("ftp:readwrite"))).length > 0;
  const [apiKeyString, setApiKeyString ] = useState("");
  const [showDeleteModal, setShowDeleteModal ] = useState(false);

  const initialValues = {
    name: (currentRecord && currentRecord.name) || '',
    scopeWildcardReadWrite: (currentRecord && currentRecord.scope && (currentRecord.scope+'').includes('*:readwrite')) || true,
    scopeFtpReadWrite: (currentRecord && currentRecord.scope && (currentRecord.scope+'').includes('ftp:readwrite')) || false,  
  };

  const getScopeStringFromValues = (values:any) => {
    let scopeArr = [];
    if (values.scopeWildcardReadWrite) {
      scopeArr.push('*:readwrite');
    }
    if (values.scopeFtpReadWrite) {
      scopeArr.push('ftp:readwrite');
    }

    return scopeArr.join(" ");
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      scope: getScopeStringFromValues(values),
    };

    fetch(`/api/v4/personalapikeys/`, {
      credentials: 'same-origin',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(data => {
        const status = data.status;
        if (status === 201) {
          data.json().then((record: any)=>{
            setApiKeyString(record.key+'');
          })
        } else {
          props.addNotification(status, 2000);
          console.error(data);
        };
      })
      .catch(console.error);
  };

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
          readOnly={currentRecord}
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
          readOnly={!!currentRecord}
          validated={values.scopeWildcardReadWrite === true || values.scopeFtpReadWrite === true }
          errorMessage={(values.scopeWildcardReadWrite === true || values.scopeFtpReadWrite === true)? false : "Chose at least 1 scope: read/ write or FTP"}
        />
        <CheckBox
          title={'FTP'}
          htmlTitle={recordWithFtpExists && !currentRecord? "There exists already a record with scope FTP in your api keys. Only one is allowed." : 'FTP'}
          name={'scopeFtpReadWrite'}
          value={values.scopeFtpReadWrite}
          valueChanged={bool => handleValueChange('scopeFtpReadWrite', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!!currentRecord || recordWithFtpExists}
          
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/personal_api_keys'}
          />
          <div style={{display: "flex"}}>
            {currentRecord?
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true)
                    },
                  ]} 
                />
            :
              <SubmitButton
                onClick={tryToSubmitForm}
              />
            }
          </div>
        </div>
      </form>
      {apiKeyString !== "" ? (
        <Modal
          title={'Save this key!'}
          buttonConfirmName={'Close'}
          onClickButtonConfirm={() => {
            setApiKeyString("");
            props.history.push('/personal_api_keys');
          }}
        >
          <p>
            Save this key somewhere on your computer.
            <br/>
            <br/>
            Key cannot be retrieved after closing this window.
            <br/>
            <br/>
          </p>
          <div
            style={{
              backgroundColor: "#2fcbab",
              borderWidth: "2px",
              borderStyle: "solid",
              borderRadius: "4px",
              borderColor: "var(--color-header)",
              padding: "16px"
            }}
          >
            <span>
              {apiKeyString}
            </span>
            <button 
              className={styles.KeyCopyButton}
              onClick={() => {
                navigator.clipboard.writeText(apiKeyString).then(() => {
                  props.addNotification("Copied to clipboard", 2000);
                }, () => {
                  props.addNotification("Failed copying ! \nTry manually instead", 2000);
                }
                );
              }}
            >
              <i className={"fa fa-clone"}></i>
            </button>
          </div>
        </Modal>
      ) : null}
      {currentRecord && showDeleteModal ? (
        <DeleteModal
          rows={[currentRecord]}
          displayContent={[{name: "name", width: 65}, {name: "prefix", width: 35}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={'/personal_api_keys'}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

const PersonalApiKeyForm = connect(null, mapPropsToDispatch)(withRouter(PersonalApiKeyFormModel));

export { PersonalApiKeyForm };