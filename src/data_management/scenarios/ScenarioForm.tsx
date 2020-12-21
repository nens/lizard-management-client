import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { SelectBox } from '../../form/SelectBox';
import { getOrganisations, getSelectedOrganisation, getSupplierIds } from '../../reducers';
import { useForm, Values } from '../../form/useForm';
import { addFilesToQueue, addNotification } from '../../actions';
import rasterSourceIcon from "../../images/raster_source_icon.svg";
import formStyles from './../../styles/Forms.module.css';

interface Props {
  currentScenario: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void,
  addFilesToQueue: (files: File[]) => void,
};
interface RouteParams {
  uuid: string;
};

const RasterSourceForm: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentScenario } = props;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const organisationsToSwitchTo = organisations.filter((organisation: any) => organisation.roles.includes("manager"))
  const supplierIds = useSelector(getSupplierIds);

  const initialValues = {
    name: currentScenario.name,
    modelName: currentScenario.model_name,
    supplier: currentScenario.username,
    organisation: currentScenario.organisation.uuid.replace(/-/g, "") || null,
  };

  const onSubmit = (values: Values) => {
    const body = {
      name: values.name as string,
      organisation: values.organisation as string,
      access_modifier: values.accessModifier as string,
      description: values.description as string,
      supplier: values.supplierName as string,
      supplier_code: values.supplierCode as string,
      temporal: values.temporal as boolean,
      interval: values.interval as string,
    };
    // patchRasterSource(currentScenario.uuid as string, body)
    //   .then(data => {
    //     const status = data.response.status;
    //     if (status === 200) {
    //       props.addNotification('Success! Scenario updated', 2000);
    //       // redirect back to the table of raster sources
    //       props.history.push('/data_management/scenarios/');
    //     } else {
    //       props.addNotification(status, 2000);
    //       console.error(data);
    //     };
    //   })
    //   .catch(e => console.error(e));

    console.log('submitted', body);
  };

  const {
    values,
    // triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={rasterSourceIcon}
      imgAltDescription={"Raster-Source icon"}
      headerText={"Scenarios"}
      explainationText={"Edit a 3Di scenario."}
      backUrl={"/data_management/scenarios/"}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <span className={formStyles.FormFieldTitle}>
          1: General
        </span>
        <TextInput
          title={'Name *'}
          name={'name'}
          value={values.name as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
        />
        <TextInput
          title={'Based on model'}
          name={'modelName'}
          value={values.modelName as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <SelectBox
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation as string}
          valueChanged={value => handleValueChange('organisation', value)}
          choices={organisations.map((organisation: any) => [organisation.uuid, organisation.name])}
          validated
          readOnly={!(organisationsToSwitchTo.length > 1 && selectedOrganisation.roles.includes("manager"))}
        />
        <SelectBox
          title={'Supplier'}
          name={'supplier'}
          value={values.supplier as string}
          valueChanged={value => handleValueChange('supplier', value)}
          choices={supplierIds.available.map((suppl:any)=>
            [suppl.username, suppl.username]
          )}
          showSearchField={true}
          validated
          readOnly={!selectedOrganisation.roles.includes("manager")}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/scenarios/'}
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
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
  addFilesToQueue: (files: File[]) => dispatch(addFilesToQueue(files)),
});

export default connect(null, mapPropsToDispatch)(withRouter(RasterSourceForm));