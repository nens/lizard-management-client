import React from 'react';
import {useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { TextInput } from './../form/TextInput';
import { SubmitButton } from '../form/SubmitButton';
import { CancelButton } from '../form/CancelButton';
import { useForm, Values } from '../form/useForm';
import { minLength } from '../form/validators';
import { addNotification } from '../actions';
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";
import formStyles from './../styles/Forms.module.css';
import { personalApiKeysFormHelpText } from '../utils/helpTextForForms';
import { CheckBox } from './../form/CheckBox';
import Modal from '../components/Modal';
import { ModalDeleteContent } from '../components/ModalDeleteContent';
import FormActionButtons from '../components/FormActionButtons';


interface Props {
  currentRecord?: any;
  allPersonalApiKeys?: [];
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};
interface RouteParams {
  uuid: string;
};

const PersonalApiKeyFormModel: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord, allPersonalApiKeys } = props;
  // @ts-ignore
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
  }

  const onDelete = () => {
    const body = {};

    currentRecord && fetch(`/api/v4/personalapikeys/${currentRecord.prefix}/`, {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
      .then(data => {
        const status = data.status;
        if (status === 204) {
          props.addNotification('Success! API key deleted', 2000);
          props.history.push('/personal_api_keys/');
        } else {
          props.addNotification(status, 2000);
          console.error(data);
        };
      })
      .catch(console.error);
  }

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
          // setting both modal and snackbar message is a bit too much so I comment snackbar message out
          // props.addNotification('Success! Personal API key generated', 2000);
          data.json().then((record: any)=>{
            setApiKeyString(record.key+'');
          })
          // do not redirect because we need to show the api key modal
          // props.history.push('/personal_api_keys/');
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
      backUrl={"/personal_api_keys"}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'name'}
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
          Scope
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
          <div style={{
            display: "flex"
          }}>
            {currentRecord?
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => { setShowDeleteModal(true); }
                    },
                  ]} 
                />
            :null}
            {!currentRecord?
            <SubmitButton
              onClick={tryToSubmitForm} 
            />
            :null}
        </div>
        </div>
      </form>
      {
        apiKeyString !== ""
        // true
        ?
      <Modal
           title={'Save this key!'}
           buttonConfirmName={'Close'}
           onClickButtonConfirm={() => {
              setApiKeyString("");
              props.history.push('/personal_api_keys/');
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
            <button style={{
              border: "none",
              borderWidth: "none",
              backgroundColor: "transparent"
            }}
            onClick={() => navigator.clipboard.writeText(apiKeyString)}
            >
              <i className={"fa fa-clone"}></i>
            </button>
          </div>
        </Modal>
        :null}
        { 
        currentRecord && showDeleteModal?
           <Modal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
              onDelete();
              setShowDeleteModal(false);
           }}
           cancelAction={()=>{
            setShowDeleteModal(false)
          }}
          disableButtons={false}
         >
           
           <p>Are you sure? Undoing is not possible. You are deleting the following personal API key:</p>
           
           {ModalDeleteContent([currentRecord], false, [{name: "name", width: 65}, {name: "prefix", width: 25}])}
           
         </Modal>
        :
          null
        }
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

const PersonalApiKeyForm = connect(null, mapPropsToDispatch)(withRouter(PersonalApiKeyFormModel));

export { PersonalApiKeyForm };