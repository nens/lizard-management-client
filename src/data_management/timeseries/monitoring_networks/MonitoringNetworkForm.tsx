import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { TextInput } from './../../../form/TextInput';
import { TextArea } from '../../../form/TextArea';
import { AccessModifier } from '../../../form/AccessModifier';
import { SelectDropdown } from '../../../form/SelectDropdown';
import { FormButton } from '../../../form/FormButton';
import { SubmitButton } from '../../../form/SubmitButton';
import { CancelButton } from '../../../form/CancelButton';
import { useForm, Values } from '../../../form/useForm';
import { minLength } from '../../../form/validators';
import { addNotification } from '../../../actions';
import { getOrganisations, getSelectedOrganisation } from '../../../reducers';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import { monitoringNetworkFormHelpText } from '../../../utils/help_texts/helpTextForMonitoringNetworks';
import { fetchWithOptions } from '../../../utils/fetchWithOptions';
import { baseUrl } from './MonitoringNetworksTable';
import TimeseriesModal from './TimeseriesModal';
import FormActionButtons from '../../../components/FormActionButtons';
import DeleteModal from '../../../components/DeleteModal';
import formStyles from './../../../styles/Forms.module.css';
import monitoringNetworkIcon from "../../../images/monitoring_network_icon.svg";

interface Props {
  currentNetwork?: any
};

const backUrl = "/data_management/timeseries/monitoring_networks";

const MonitoringNetworkForm = (props: Props & DispatchProps & RouteComponentProps) => {
  const { currentNetwork } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const organisations = useSelector(getOrganisations).available;
  const organisationsToSwitchTo = organisations.filter((org: any) => org.roles.includes('admin'));
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Modal to manage timeseries of a monitoring network
  const [timeseriesModal, setTimeseriesModal] = useState<boolean>(false);

  const initialValues = currentNetwork ? {
    name: currentNetwork.name,
    description: currentNetwork.description,
    accessModifier: currentNetwork.access_modifier,
    organisation: currentNetwork.organisation ? convertToSelectObject(currentNetwork.organisation.uuid, currentNetwork.organisation.name) : null
  } : {
    name: null,
    description: null,
    accessModifier: 'Private',
    organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid, selectedOrganisation.name) : null
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      description: values.description || '',
      access_modifier: values.accessModifier,
      organisation: values.organisation && values.organisation.value
    };

    if (!currentNetwork) {
      fetch("/api/v4/monitoringnetworks/", {
        credentials: "same-origin",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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
      fetch(`/api/v4/monitoringnetworks/${currentNetwork.uuid}/`, {
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
    handleValueChange,
    handleSubmit,
    handleReset,
    clearInput,
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={monitoringNetworkIcon}
      imgAltDescription={"Network icon"}
      headerText={"Monitoring Networks"}
      explanationText={monitoringNetworkFormHelpText[fieldOnFocus] || monitoringNetworkFormHelpText['default']}
      backUrl={backUrl}
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
          placeholder={'Please enter at least 3 character'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {currentNetwork ? (
          <TextInput
            title={'UUID'}
            name={'uuid'}
            value={currentNetwork.uuid}
            valueChanged={handleInputChange}
            validated
            onFocus={handleFocus}
            onBlur={handleBlur}
            readOnly
          />
        ) : null}
        <TextArea
          title={'Description'}
          name={'description'}
          value={values.description}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <FormButton
          name={'timeseriesModal'}
          title={'Time Series'}
          text={'Manage'}
          onClick={e => {
            e.preventDefault();
            setTimeseriesModal(true);
          }}
          readOnly={!currentNetwork}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Accessibility *'}
          name={'accessModifier'}
          value={values.accessModifier}
          valueChanged={value => handleValueChange('accessModifier', value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={'Organisation *'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation}
          valueChanged={value => handleValueChange('organisation', value)}
          options={organisations.map((organisation: any) => convertToSelectObject(organisation.uuid, organisation.name))}
          validated={values.organisation !== null && values.organisation !== ''}
          errorMessage={'Please select an organisation'}
          triedToSubmit={triedToSubmit}
          readOnly={!(!currentNetwork && organisationsToSwitchTo.length > 0 && selectedOrganisation.roles.includes('admin'))}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={backUrl}
          />
          <div style={{display: "flex"}}>
            {currentNetwork ? (
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
      {timeseriesModal ? (
        <TimeseriesModal
          currentMonitoringNetworkUuid={currentNetwork ? currentNetwork.uuid : null}
          handleClose={() => setTimeseriesModal(false)}
        />
      ) : null}
      {currentNetwork && showDeleteModal ? (
        <DeleteModal
          rows={[currentNetwork]}
          displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={backUrl}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(MonitoringNetworkForm));