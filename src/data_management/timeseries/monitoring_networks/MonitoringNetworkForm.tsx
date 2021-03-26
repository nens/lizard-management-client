import React from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { minLength } from '../../../form/validators';
import { addNotification } from '../../../actions';
import { getSelectedOrganisation } from '../../../reducers';
import formStyles from './../../../styles/Forms.module.css';
import monitoringNetworkIcon from "../../../images/monitoring_network_icon.svg";

interface Props {
  currentNetwork?: any
};

const backUrl = "/data_management/timeseries/monitoring_networks";

const MonitoringNetworkForm = (props: Props & DispatchProps & RouteComponentProps) => {
  const { currentNetwork } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const initialValues = currentNetwork ? {
    name: currentNetwork.name,
  } : {
    name: null,
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
    };

    if (!currentNetwork) {
      fetch("/api/v4/monitoringnetworks/", {
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
          props.addNotification('Success! New monitoring network created', 2000);
          props.history.push(backUrl);
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
      fetch(`/api/v4/contacts/${currentNetwork.uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! Monitoring network updated', 2000);
          props.history.push(backUrl);
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        }
      })
      .catch(console.error);
    };
  };

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
    // fieldOnFocus,
    // handleBlur,
    // handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={monitoringNetworkIcon}
      imgAltDescription={"Network icon"}
      headerText={"Monitoring Networks"}
      explanationText={"Select a field to get more information."}
      backUrl={backUrl}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'Name *'}
          name={'name'}
          placeholder={'Please enter at least 3 character'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.firstName)}
          errorMessage={minLength(3, values.firstName)}
          triedToSubmit={triedToSubmit}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={backUrl}
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
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(MonitoringNetworkForm));