import React from 'react';
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
import { SelectDropdown } from '../../form/SelectDropdown';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { minLength } from '../../form/validators';
import formStyles from './../../styles/Forms.module.css';
import templateIcon from "../../images/templates@3x.svg";

interface Props {
  currentTemplate?: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};

export const availableParameters = [
  // {
  //   parameter: "from",
  //   parameterText: "[[var:from]]",
  //   description: "Name of the sender",
  //   templateType: "email"
  // },
  // {
  //   parameter: "from_email",
  //   parameterText: "[[var:from_email]]",
  //   description: "E-mail address of the sender",
  //   templateType: "email"
  // },
  // {
  //   parameter: "organisation_name",
  //   parameterText: "[[var:organisation_name]]",
  //   description: "Name of the sending organisation"
  // },
  // {
  //   parameter: "name",
  //   parameterText: "[[var:name]]",
  //   description: "First and last name of recipient"
  // },
  {
    parameter: "email",
    parameterText: "[[var:email]]",
    description: "E-mail address of the recipient",
    templateType: "email"
  },
  {
    parameter: "alarm_name",
    parameterText: "[[var:alarm_name]]",
    description: "Name of the alarm"
  },
  {
    parameter: "warning_value",
    parameterText: "[[var:warning_value]]",
    description: "Numerical value of the threshold"
  },
  {
    parameter: "warning_level",
    parameterText: "[[var:warning_level]]",
    description: "Name of the threshold"
  },
  {
    parameter: "threshold_timestamp",
    parameterText: "[[var:threshold_timestamp]]",
    description: "Time the threshold was crossed"
  },
  {
    parameter: "trigger_timestamp",
    parameterText: "[[var:trigger_timestamp]]",
    description: "Moment the alarm was analysed"
  },
  {
    parameter: "warning_timestamp",
    parameterText: "[[var:warning_timestamp]]",
    description: "Time the peak or trough is reached"
  },
  {
    parameter: "first_timestamp",
    parameterText: "[[var:first_timestamp]]",
    description: "First time the alarm was triggered"
  },
  {
    parameter: "phone_number",
    parameterText: "[[var:phone_number]]",
    description: "Telephone number of recipient",
    templateType: "sms"
  }
];

const TemplateForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentTemplate } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const initialValues = currentTemplate ? {
    name: currentTemplate.name,
    type: convertToSelectObject(currentTemplate.type, currentTemplate.type.toUpperCase()),
    subject: currentTemplate.subject,
    text: currentTemplate.text
  } : {
    name: null,
    type: 'email',
    subject: null,
    text: null
  };

  const onSubmit = (values: Values) => {
    const body = {
    };

    if (!currentTemplate) {
      fetch("/api/v4/messages/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
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
    // fieldOnFocus,
    // handleBlur,
    // handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={templateIcon}
      imgAltDescription={"Template icon"}
      headerText={"Templates"}
      explanationText={"Templates are used to create messages for your alarms. You can choose between an email or text message."} 
      backUrl={"/alarms/templates"}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'Name *'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.name)}
          errorMessage={minLength(1, values.name)}
          triedToSubmit={triedToSubmit}
        />
        <SelectDropdown
          title={'Type'}
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
        />
        <TextInput
          title={'Subject'}
          name={'subject'}
          value={values.subject}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
        />
        <TextArea
          title={'Message'}
          name={'text'}
          value={values.text}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/alarms/templates'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

export default connect(null, mapPropsToDispatch)(withRouter(TemplateForm));