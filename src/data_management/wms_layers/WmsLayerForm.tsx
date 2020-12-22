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
import { SelectBox } from '../../form/SelectBox';
import { SlushBucket } from '../../form/SlushBucket';
import { AccessModifier } from '../../form/AccessModifier';
import { useForm, Values } from '../../form/useForm';
import { greaterThanMin, minLength, rangeCheck, jsonValidator} from '../../form/validators';
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
  const supplierIds = useSelector(getSupplierIds);
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const datasets = useSelector(getDatasets).available;
  const organisationsToSwitchTo = organisations.filter((org:any) => org.roles.includes('admin'));

  const initialValues: WmsLayerFormType = currentWmsLayer ? wmsLayerReceivedFromApiToForm(currentWmsLayer) : wmsLayerGetDefaultFormValues(selectedOrganisation.uuid);
  
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
        // @ts-ignore
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
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  const currentSelectedOrganisation = organisations.find((org: any) => org.uuid === values.organisation.replace(/-/g, ""));

  return (
    <ExplainSideColumn
      imgUrl={wmsIcon}
      imgAltDescription={"WMS-Layer icon"}
      headerText={"WMS Layers"}
      explainationText={"WMS-Layers allow to configure layers in lizard even if they are hosted on another platform"} 
      backUrl={"/data_management/wms_layers"}
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
          value={values.name as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name as string)}
          errorMessage={minLength(3, values.name as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextArea
          title={'Description'}
          name={'description'}
          placeholder={''}
          value={values.description as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
        />
        <SlushBucket
          title={'Tags / Datasets'}
          name={'datasets'}
          placeholder={'Search datasets'}
          value={values.datasets as string[]}
          choices={datasets.map((dataset: any) => {
            return {
              display: dataset.slug,
              value: dataset.slug,
            }
          })}
          valueChanged={(value: any) => {
            handleValueChange('datasets', value)
          }}
          validated
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <TextInput
          title={'WMS URL *'}
          name={'wms_url'}
          placeholder={'http://example.com'}
          value={values.wms_url as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.wms_url as string)}
          errorMessage={minLength(3, values.wms_url as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Slug *'}
          name={'slug'}
          placeholder={'Slug for this WMS'}
          value={values.slug as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(1, values.slug as string)}
          errorMessage={minLength(1, values.slug as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Download URL'}
          name={'download_url'}
          placeholder={'http://example.com'}
          value={values.download_url as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          // errorMessage={minLength(3, values.name as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Legend URL'}
          name={'legend_url'}
          placeholder={'http://example.com'}
          value={values.legend_url as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Get Feature URL'}
          name={'get_feature_info_url'}
          placeholder={'http://example.com'}
          value={values.get_feature_info_url as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          triedToSubmit={triedToSubmit}
        />
        <CheckBox
          title={'Tiled WMS'}
          name={'tiled'}
          value={values.tiled as boolean}
          valueChanged={bool => handleValueChange('tiled', bool)}
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
            title={'Min Zoom'}
            name={'min_zoom'}
            value={values.min_zoom + ''}
            valueChanged={handleInputChange}
            clearInput={clearInput}
            validated={!rangeCheck(Number(values.min_zoom), 0, 31)}
            errorMessage={rangeCheck(Number(values.min_zoom), 0, 31)}
            triedToSubmit={triedToSubmit}
          />
          <span style={{ width: 20 }}/>
          <IntegerInput
            title={'Max Zoom'}
            name={'max_zoom'}
            value={values.max_zoom + ''}
            valueChanged={handleInputChange}
            clearInput={clearInput}
            validated={!rangeCheck(Number(values.max_zoom), 0, 31) && !greaterThanMin(Number(values.min_zoom), Number(values.max_zoom))}
            errorMessage={rangeCheck(Number(values.max_zoom), 0, 31) || greaterThanMin(Number(values.min_zoom), Number(values.max_zoom))}
            triedToSubmit={triedToSubmit}
          />
        </div>
        <SpatialBoundsField
           name={'spatial_bounds'}
           // @ts-ignore
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
        />
        <TextArea
          title={'Options (JSON)'}
          name={'options'}
          placeholder={'Enter valid JSON'}
          value={values.options as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!jsonValidator(values.options as string)}
          errorMessage={jsonValidator(values.options as string)}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Access Modifier'}
          name={'access_modifier'}
          value={values.access_modifier as string}
          valueChanged={value => handleValueChange('access_modifier', value)}
        />
        <CheckBox
          title={'Shared with other organisations'}
          name={'sharedWithCheckbox'}
          value={values.sharedWithCheckbox as boolean}
          valueChanged={bool => handleValueChange('sharedWithCheckbox', bool)}
        />
        {values.sharedWithCheckbox ? (
          <SlushBucket
            title={'Organisations'}
            name={'shared_with'}
            placeholder={'Search organisations'}
            // str.replace is needed because we still use uuid without dashes everywhere. If possible we should remove this everywhere.
            value={(values.shared_with as string[]).map((str)=>str.replace(/-/g, ""))}
            choices={organisationsToSharedWith.map((organisation: any) => {
              return {
                display: organisation.name,
                value: organisation.uuid
              }
            })}
            valueChanged={(value: any) => handleValueChange('shared_with', value)}
            validated
          />
        ) : null}
        <SelectBox
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={typeof values.organisation === "string" ? (values.organisation as string).replace(/-/g, ""): (values.organisation as string) }
          valueChanged={value => handleValueChange('organisation', value)}
          choices={organisationsToSwitchTo.map((organisation: any) => [organisation.uuid, organisation.name])}
          validated={values.organisation !== null && values.organisation !== ""}
          errorMessage={'Please select an organisation'}
          readOnly={!(organisationsToSwitchTo.length > 0 && currentSelectedOrganisation.roles.includes("admin"))}
        />
        <SelectBox
          title={'Supplier'}
          name={'supplier'}
          placeholder={'- Search and select -'}
          value={values.supplier as string}
          valueChanged={value => handleValueChange('supplier', value)}
          choices={supplierIds.available.map((suppl:any)=>
            [suppl.username, suppl.username]
          )}
          showSearchField={true}
          validated
          readOnly={!(supplierIds.available.length > 0 && currentSelectedOrganisation.roles.includes("admin"))}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/data_management/raster_layers'}
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