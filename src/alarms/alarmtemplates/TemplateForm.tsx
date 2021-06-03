import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { addNotification } from '../../actions';
import { getSelectedOrganisation } from '../../reducers';
import { TextArea } from '../../form/TextArea';
import { CheckBox } from '../../form/CheckBox';
import { SelectDropdown } from '../../form/SelectDropdown';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { minLength } from '../../form/validators';
import { templateFormHelpText } from '../../utils/help_texts/helpTextForAlarmTemplate';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { baseUrl } from './TemplateTable';
import DeleteModal from '../../components/DeleteModal';
import formStyles from './../../styles/Forms.module.css';
import buttonStyles from './../../styles/Buttons.module.css';
import templateIcon from "../../images/templates@3x.svg";
import FormActionButtons from '../../components/FormActionButtons';

interface Props {
  currentTemplate?: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};

export const availableParameters = [
  {
    parameter: "first_name",
    parameterText: "[[var:first_name]]",
    label: "first name recipient",
    description: "First name of the recipient"
  },
  {
    parameter: "last_name",
    parameterText: "[[var:last_name]]",
    label: "last name recipient",
    description: "Last name of the recipient"
  },
  {
    parameter: "email",
    parameterText: "[[var:email]]",
    label: "email recipient",
    description: "E-mail address of the recipient",
    templateType: "email"
  },
  {
    parameter: "alarm_name",
    parameterText: "[[var:alarm_name]]",
    label: "name alarm",
    description: "Name of the alarm"
  },
  {
    parameter: "warning_value",
    parameterText: "[[var:warning_value]]",
    label: "value threshold",
    description: "Numerical value of the threshold"
  },
  {
    parameter: "warning_level",
    parameterText: "[[var:warning_level]]",
    label: "status threshold",
    description: "Name of the threshold"
  },
  {
    parameter: "threshold_timestamp",
    parameterText: "[[var:threshold_timestamp]]",
    label: "timestamp threshold",
    description: "Time the threshold was crossed"
  },
  {
    parameter: "trigger_timestamp",
    parameterText: "[[var:trigger_timestamp]]",
    label: "trigger timestamp",
    description: "Moment the alarm was analysed"
  },
  {
    parameter: "warning_timestamp",
    parameterText: "[[var:warning_timestamp]]",
    label: "warning timestamp",
    description: "Time the peak or trough is reached"
  },
  {
    parameter: "first_timestamp",
    parameterText: "[[var:first_timestamp]]",
    label: "first timestamp",
    description: "First time the alarm was triggered"
  }
];

const TemplateForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentTemplate } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const initialValues = currentTemplate ? {
    name: currentTemplate.name,
    type: convertToSelectObject(currentTemplate.type, currentTemplate.type.toUpperCase()),
    subject: currentTemplate.subject,
    message: currentTemplate.type === 'sms' ? currentTemplate.text : currentTemplate.html, // if email, read html field
    noFurtherImpactOption: currentTemplate.no_further_impact,
  } : {
    name: null,
    type: convertToSelectObject('email', 'EMAIL'),
    subject: null,
    message: '',
    noFurtherImpactOption: false,
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      subject: values.subject,
      text: values.message,
      html: values.message,
      no_further_impact: values.noFurtherImpactOption,
    };

    if (!currentTemplate) {
      fetch("/api/v4/messages/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          type: values.type.value,
          organisation: selectedOrganisation.uuid
        })
      })
      .then(response => {
        const status = response.status;
        if (status === 201) {
          props.addNotification('Success! New template created', 2000);
          props.history.push("/alarms/templates");
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
      fetch(`/api/v4/messages/${currentTemplate.id}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! Template updated', 2000);
          props.history.push("/alarms/templates");
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        }
      })
      .catch(console.error);
    }
  }

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

  const insertTextInTemplateText = (templateText: string, addedText: string) => {
    let newTemplateText = "";
    const element = document.getElementById("message") as HTMLTextAreaElement;
    let caretPosition = 0;

    if (element.selectionStart || element.selectionStart === 0) {
      newTemplateText = templateText.substring(0, element.selectionStart) +
        addedText + templateText.substring(element.selectionEnd);
      caretPosition = (templateText.substring(0, element.selectionStart) + addedText).length;
    } else {
      newTemplateText = templateText + addedText;
      caretPosition = (templateText + addedText).length;
    };

    handleValueChange('message', newTemplateText);
    element.focus(); // set focus back to the text area element
    window.setTimeout(()=>{element.setSelectionRange(caretPosition, caretPosition)},0);
  };

  const RenderBlocks = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <span
        className={formStyles.LabelTitle}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }}
        title={'Add variables to message'}
      >
        Blocks (click to add to message)
      </span>
      <div>
        {availableParameters.map(parameter => {
          if (!parameter.templateType || parameter.templateType === values.type.value) {
            return (
              <button
                className={buttonStyles.BlockButton}
                key={parameter.parameter}
                title={parameter.description}
                onClick={e => {
                  e.preventDefault();
                  insertTextInTemplateText(values.message || '', parameter.parameterText);
                }}
                style={{
                  marginRight: 10,
                  marginBottom: 10
                }}
                tabIndex={-1}
              >
                {parameter.parameter}
              </button>
            );
          };
          return null;
        })}
      </div>
    </div>
  );

  return (
    <ExplainSideColumn
      imgUrl={templateIcon}
      imgAltDescription={"Template icon"}
      headerText={"Templates"}
      explanationText={templateFormHelpText[fieldOnFocus] || templateFormHelpText['default']}
      backUrl={"/alarms/templates"}
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
          title={'Type *'}
          name={'type'}
          value={values.type}
          valueChanged={value => handleValueChange('type', value)}
          options={[
            {
              value: 'email',
              label: 'EMAIL'
            },
            {
              value: 'sms',
              label: 'SMS'
            }
          ]}
          validated
          readOnly={currentTemplate}
          isClearable={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Subject'}
          name={'subject'}
          value={values.subject}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={values.type.value === 'sms'}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60% 40%',
            columnGap: 20,
            marginBottom: 16,
          }}
        >
          <div>
            <TextArea
              title={'Message *'}
              name={'message'}
              value={values.message}
              valueChanged={handleInputChange}
              validated={!minLength(1, values.message)}
              errorMessage={minLength(1, values.message)}
              triedToSubmit={triedToSubmit}
              rows={10}
              onFocus={handleFocus}
              // onBlur={handleBlur}
            />
            <small>
              <FormattedMessage
                id="alarmtemplates_app.template"
                defaultMessage="Template"
              />{" "}
              ({(values.message || '').length}{" "}
              <FormattedMessage
                id="alarmtemplates_new.characters"
                defaultMessage="characters"
              />)<br />
              {values.type.value === "sms" ? (
                <i>
                  <FormattedMessage
                    id="alarmtemplates_new.sms_max_char_warning"
                    defaultMessage="SMS messages have a limit of 160 characters after substituting the parameter tags"
                  />
                </i>
              ) : null}
            </small>
          </div>
          <RenderBlocks />
        </div>
        <CheckBox
          title={'No further impact option'}
          name={'noFurtherImpactOption'}
          value={values.noFurtherImpactOption}
          valueChanged={bool => handleValueChange('noFurtherImpactOption', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/alarms/templates'}
          />
          <div style={{display: "flex"}}>
            {currentTemplate ? (
              <div style={{ marginRight: 16 }}>
                <FormActionButtons
                  actions={[
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true)
                    },
                  ]} 
                />
              </div>
            ) : null}
            <SubmitButton
              onClick={tryToSubmitForm}
            />
          </div>
        </div>
      </form>
      {currentTemplate && showDeleteModal ? (
        <DeleteModal
          rows={[currentTemplate]}
          displayContent={[{name: "name", width: 30}, {name: "type", width: 20}, {name: "id", width: 50}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={'/alarms/templates'}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapPropsToDispatch)(withRouter(TemplateForm));