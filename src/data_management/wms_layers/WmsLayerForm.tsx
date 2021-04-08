import React, { useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router';
import {  useSelector, connect } from 'react-redux';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { IntegerInput } from '../../form/IntegerInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { SelectDropdown } from '../../form/SelectDropdown';
import { AccessModifier } from '../../form/AccessModifier';
import { useForm, Values } from '../../form/useForm';
import { greaterThanMin, minLength, rangeCheck, jsonValidator, required} from '../../form/validators';
import wmsIcon from "../../images/wms@3x.svg";
import {
  getDatasets,
  getOrganisations,
  getSelectedOrganisation,
  getSupplierIds,
} from '../../reducers';
import { addNotification } from './../../actions';
import formStyles from './../../styles/Forms.module.css';
// We might later decide to use this combined minmax zoom component instead of the 2 seperate fields.
// import MinMaxZoomField, {MinMax} from '../../components/MinMaxZoomField';
import SpatialBoundsField from "../../form/SpatialBoundsField";
import { WmsLayerReceivedFromApi, wmsLayerReceivedFromApiToForm, WmsLayerFormType, wmsLayerGetDefaultFormValues, wmsLayerFormToFormSendToApi} from '../../types/WmsLayerType';
import { wmsFormHelpText } from '../../utils/help_texts/helpTextForWMS';
import { convertToSelectObject } from '../../utils/convertToSelectObject';

interface Props {
  currentWmsLayer?: WmsLayerReceivedFromApi, 
};

interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void,
};

const WmsLayerForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentWmsLayer} = props;

  const [geoserverError, setGeoserverError,] = useState(false)
  const organisationsToSharedWith = useSelector(getOrganisations).availableForRasterSharedWith;
  const supplierIds = useSelector(getSupplierIds).available;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const datasets = useSelector(getDatasets).available;
  const organisationsToSwitchTo = organisations.filter((org:any) => org.roles.includes('admin'));

  const initialValues: WmsLayerFormType = currentWmsLayer ? wmsLayerReceivedFromApiToForm(currentWmsLayer) : wmsLayerGetDefaultFormValues(selectedOrganisation);
  
  const onSubmit = (values: Values) => {

    // @ts-ignore
    const wmsLayer = wmsLayerFormToFormSendToApi(values);
    const url = "/api/v4/wmslayers/";

     if (!currentWmsLayer) {
        const opts = {
          credentials: "same-origin",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(wmsLayer),
        }
        // @ts-ignore
        fetch(url, opts)
        .then((data:any) => {
            const status = data.status;
            props.addNotification(status, 2000);
            if (status === 201) {
              props.history.push('/data_management/wms_layers');
            } else {
              console.error(data);
            };
          })
          .catch((e:any) => console.error(e));
    } else {
      const opts = {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wmsLayer)
      };
      // @ts-ignore
      fetch(url + "uuid:" + currentWmsLayer.uuid + "/", opts)
        .then((data:any) => {
          const status = data.status;
          props.addNotification(status, 2000);
          if (status === 200) {
            props.history.push('/data_management/wms_layers');
          } else {
            console.error(data);
          };
        })
        .catch((e:any) => console.error(e));
      }
  };

  const {
    values,
    triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    fieldOnFocus,
    handleFocus,
    handleBlur,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={wmsIcon}
      imgAltDescription={"WMS-Layer icon"}
      headerText={"WMS Layers"}
      explanationText={wmsFormHelpText[fieldOnFocus] || wmsFormHelpText['default']}
      backUrl={"/data_management/wms_layers"}
      fieldName={fieldOnFocus}
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
          placeholder={'Please enter at least 3 characters'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          triedToSubmit={triedToSubmit}
        />
        <TextArea
          title={'Description'}
          name={'description'}
          placeholder={''}
          value={values.description}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={'Tags / Datasets'}
          name={'datasets'}
          placeholder={'- Search and select -'}
          value={values.datasets}
          valueChanged={value => handleValueChange('datasets', value)}
          options={datasets.map((dataset: any) => convertToSelectObject(dataset.slug))}
          validated
          isMulti
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <TextInput
          title={'WMS URL *'}
          name={'wms_url'}
          placeholder={'http://example.com'}
          value={values.wms_url}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.wms_url)}
          errorMessage={minLength(3, values.wms_url)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Slug *'}
          name={'slug'}
          placeholder={'Slug for this WMS'}
          value={values.slug}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.slug)}
          errorMessage={minLength(1, values.slug)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Download URL'}
          name={'download_url'}
          placeholder={'http://example.com'}
          value={values.download_url}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Legend URL'}
          name={'legend_url'}
          placeholder={'http://example.com'}
          value={values.legend_url}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TextInput
          title={'Get Feature URL'}
          name={'get_feature_info_url'}
          placeholder={'http://example.com'}
          value={values.get_feature_info_url}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <CheckBox
          title={'Tiled WMS'}
          name={'tiled'}
          value={values.tiled}
          valueChanged={bool => handleValueChange('tiled', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {/* We might later decide to use this combined minmax zoom component instead of the 2 seperate fields */}
        {/* <MinMaxZoomField
          name={'minMaxZoom'}
          value={{
            minZoom: values.min_zoom as number,
            maxZoom: values.max_zoom as number,
          }}
          valueChanged={(value:MinMax) => { 
            if (values.min_zoom !== value.minZoom) {
              handleValueChange('min_zoom', value.minZoom);
            } else {
              handleValueChange('max_zoom', value.maxZoom);
            }
          }}
          triedToSubmit={triedToSubmit}
        /> */}
        <div style={{ display: 'flex' }}>
          <IntegerInput
            title={'Min Zoom *'}
            name={'min_zoom'}
            value={values.min_zoom + ''}
            valueChanged={handleInputChange}
            validated={
              !required('Please enter a value', values.min_zoom) &&
              !rangeCheck(Number(values.min_zoom), 0, 31)
            }
            errorMessage={
              required('Please enter a value', values.min_zoom) ||
              rangeCheck(Number(values.min_zoom), 0, 31)
            }
            triedToSubmit={triedToSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span style={{ width: 20 }}/>
          <IntegerInput
            title={'Max Zoom *'}
            name={'max_zoom'}
            value={values.max_zoom + ''}
            valueChanged={handleInputChange}
            validated={
              !required('Please enter a value', values.max_zoom) &&
              !rangeCheck(Number(values.max_zoom), 0, 31) &&
              !greaterThanMin(Number(values.min_zoom), Number(values.max_zoom))
            }
            errorMessage={
              required('Please enter a value', values.max_zoom) ||
              rangeCheck(Number(values.max_zoom), 0, 31) ||
              greaterThanMin(Number(values.min_zoom), Number(values.max_zoom))
            }
            triedToSubmit={triedToSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        <SpatialBoundsField
           title={'Spatial Bounds'}
           name={'spatial_bounds'}
           value={values.spatial_bounds}
           valueChanged={(value:any) => handleValueChange('spatial_bounds', value)}
           clearInput={clearInput}
           triedToSubmit={triedToSubmit}
           otherValues= {{
            wmsLayerName: values.name + '',
            wmsLayerSlug: values.slug + '',
            wmsLayerUrl: values.wms_url + '',
           }}
           geoServerError={geoserverError}
           showGeoServerError={()=>setGeoserverError(true)}
           onFocus={handleFocus}
           onBlur={handleBlur}
        />
        <TextArea
          title={'Options (JSON) *'}
          name={'options'}
          placeholder={'Enter valid JSON'}
          value={values.options}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!jsonValidator(values.options)}
          errorMessage={jsonValidator(values.options)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Accessibility *'}
          name={'access_modifier'}
          value={values.access_modifier}
          valueChanged={value => handleValueChange('access_modifier', value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <CheckBox
          title={'Shared with other organisations'}
          name={'sharedWithCheckbox'}
          value={values.sharedWithCheckbox}
          valueChanged={bool => handleValueChange('sharedWithCheckbox', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {values.sharedWithCheckbox ? (
          <SelectDropdown
            title={'Organisations to share with'}
            name={'shared_with'}
            placeholder={'Search organisations'}
            value={values.shared_with}
            options={organisationsToSharedWith.map((organisation: any) => convertToSelectObject(organisation.uuid, organisation.name))}
            valueChanged={value => handleValueChange('shared_with', value)}
            validated
            isMulti
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : null}
        <SelectDropdown
          title={'Organisation *'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={typeof values.organisation === "string" ? values.organisation.replace(/-/g, ""): (values.organisation) }
          valueChanged={value => handleValueChange('organisation', value)}
          options={organisations.map((organisation: any) => convertToSelectObject(organisation.uuid, organisation.name))}
          validated={values.organisation !== null && values.organisation !== ""}
          errorMessage={'Please select an organisation'}
          readOnly={!(organisationsToSwitchTo.length > 0 && selectedOrganisation.roles.includes("admin"))}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <SelectDropdown
          title={'Supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier}
          valueChanged={value => handleValueChange('supplier', value)}
          options={supplierIds.map((suppl: any) => convertToSelectObject(suppl.username))}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!(supplierIds.length > 0 && selectedOrganisation.roles.includes("admin"))}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/wms_layers'}
          />
          <SubmitButton
            onClick={tryToSubmitForm}
          />
        </div>
      </form>
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
});

export default connect(null, mapDispatchToProps)(withRouter(WmsLayerForm));