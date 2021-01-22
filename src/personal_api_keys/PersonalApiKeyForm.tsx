import React from 'react';
import {useState} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, /*useSelector*/ } from 'react-redux';
// import { getOrganisations, getUsername } from '../reducers';
// import { ScenarioResult } from '../form/ScenarioResult';
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
import { ModalDeleteContent } from '../components/ModalDeleteContent'
import FormActionButtons from '../components/FormActionButtons';


interface Props {
  currentRecord?: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};
interface RouteParams {
  uuid: string;
};

const PersonalApiKeyFormModel: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord } = props;
  // const organisations = useSelector(getOrganisations).available;
  // const scenarioOrganisation = organisations.find((org: any) => org.uuid === currentRecord.organisation.uuid.replace(/-/g, ""));
  // const username = useSelector(getUsername);

  const [apiKeyString, setApiKeyString ] = useState("");
  const [showDeleteModal, setShowDeleteModal ] = useState(false);

  const initialValues = {
    name: (currentRecord && currentRecord.name) || '',
    scopeWildcardReadWrite: (currentRecord && currentRecord.scope && (currentRecord.scope+'').includes('*:readwrite')) || true,
    scopeFtpReadWrite: (currentRecord && currentRecord.scope && (currentRecord.scope+'').includes('ftp:readwrite')) || false,  
    // modelName: currentRecord.model_name || '',
    // supplier: currentRecord.username || '',
    // organisation: currentRecord.organisation.name || '',
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
          console.log('data', data);
          props.addNotification('Success! Personal API key generated', 2000);
          data.json().then((record: any)=>{
            console.log('record', record);
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
      headerText={"Label types"}
      explanationText={personalApiKeysFormHelpText[fieldOnFocus] || personalApiKeysFormHelpText['default']}
      // explanationText={"Personal API keys can be used to authenticate external applications in Lizard"} 
      backUrl={"/personal_api_keys"}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        {/* <span className={formStyles.FormFieldTitle}>
          1: General
        </span> */}
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
        />
        <CheckBox
          title={'FTP'}
          name={'scopeFtpReadWrite'}
          value={values.scopeFtpReadWrite}
          valueChanged={bool => handleValueChange('scopeFtpReadWrite', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!!currentRecord}
        />
        {/* <TextInput
          title={'Based on model'}
          name={'modelName'}
          value={values.modelName}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        /> */}
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/personal_api_keys'}
          />
          {/* {!currentRecord?
          <SubmitButton
            onClick={tryToSubmitForm}
          />
          :null} */}
          <div style={{
            display: "flex"
          }}>
            {currentRecord?
            //  <>
            //  {/* <div style={{ marginRight: "16px" }}> */}
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => { setShowDeleteModal(true); }
                    },
                  ]} 
                />
              // {/* </div> */}
                
              // </>
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
           title={'Your newly created api key?'}
           buttonConfirmName={'Close'}
           onClickButtonConfirm={() => {
              // onDelete();
              // setShowDeleteModal(false);
              setApiKeyString("");
              props.history.push('/personal_api_keys/');
           }}
          //  cancelAction={()=>{
          //   setShowDeleteModal(false)
          // }}
          // disableButtons={false}
         >
           
          <p>
            Store this personal API key somewhere save.
            This key will only be shown once !
          </p>
          <div>
            <span>
              {apiKeyString}
            </span>
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