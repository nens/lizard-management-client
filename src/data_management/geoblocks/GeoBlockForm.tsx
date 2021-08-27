import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SelectDropdown } from '../../form/SelectDropdown';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { AccessModifier } from '../../form/AccessModifier';
import { useForm, Values } from '../../form/useForm';
import { getSelectedOrganisation } from '../../reducers';
import { addNotification } from './../../actions';
import geoblockIcon from "../../images/geoblock.svg";
import formStyles from './../../styles/Forms.module.css';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { fetchSuppliers } from '../rasters/RasterSourceForm';
import { FormButton } from '../../form/FormButton';
import GeoBlockBuildModal from './GeoBlockBuildModal';

interface Props {
  currentRecord?: any,
};

const GeoBlockForm: React.FC<Props & DispatchProps & RouteComponentProps> = (props) => {
  const { currentRecord } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  const [buildModal, setBuildModal] = useState<boolean>(false);

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    uuid: currentRecord.uuid,
    description: currentRecord.description,
    accessModifier: currentRecord.access_modifier,
    supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
  } : {
    name: null,
    description: null,
    accessModifier: 'Private',
    supplier: null,
  };
  const onSubmit = (values: Values) => {
    const body = {
      name: values.name,
      description: values.description,
      access_modifier: values.accessModifier,
      supplier: values.supplier && values.supplier.label,
    };
    if (!currentRecord) {
      console.log('create new geoblock: ', body);
    } else {
      console.log('edit a geoblock: ', body);
    };
  };

  const {
    values,
    // triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    fieldOnFocus,
    handleBlur,
    handleFocus,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={geoblockIcon}
      imgAltDescription={"GeoBlock icon"}
      headerText={"Geo Blocks"}
      explanationText={'Geo Blocks'}
      backUrl={"/management/data_management/geoblocks"}
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
          placeholder={'Please enter at least 3 characters'}
          value={values.name}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          validated
          readOnly
        />
        {currentRecord ? (
          <TextInput
            title={'UUID'}
            name={'uuid'}
            value={values.uuid}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated
          readOnly
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <FormButton
          name={'geoBlockBuildModal'}
          title={'Geo Block'}
          text={'Geo Block Builder'}
          onClick={e => {
            e.preventDefault();
            setBuildModal(true);
          }}
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
          readOnly
        />
        <SelectDropdown
          title={'Supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier}
          valueChanged={value => handleValueChange('supplier', value)}
          options={[]}
          validated
          isAsync
          isCached
          loadOptions={searchInput => fetchSuppliers(selectedOrganisation.uuid, searchInput)}
          readOnly={!selectedOrganisation.roles.includes('admin')}
          dropUp
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/data_management/geoblocks'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
      {buildModal ? (
        <GeoBlockBuildModal
          handleClose={() => setBuildModal(false)}
          currentRecord={currentRecord}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(withRouter(GeoBlockForm));