import React, { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { createRasterLayer, patchRasterLayer, RasterLayerFromAPI, RasterSourceFromAPI } from '../../api/rasters';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { SelectBox } from '../../form/SelectBox';
import { SlushBucket } from '../../form/SlushBucket';
import { AccessModifier } from '../../form/AccessModifier';
import ColorMapInput, { ColorMapOptions, colorMapValidator } from '../../form/ColorMapInput';
import { useForm, Values } from '../../form/useForm';
import { minLength, required } from '../../form/validators';
import wmsIcon from "../../images/wms@3x.svg";
import {
  getColorMaps,
  getDatasets,
  getObservationTypes,
  getOrganisations,
  getRasterSourceUUID,
  getSelectedOrganisation
} from '../../reducers';
import { optionsHasLayers } from '../../utils/rasterOptionFunctions';
import { getUuidFromUrl } from '../../utils/getUuidFromUrl';
import { addNotification, removeRasterSourceUUID } from './../../actions';
import rasterIcon from "../../images/raster_layers_logo_explainbar.svg";
import formStyles from './../../styles/Forms.module.css';
import SpatialBoundsField, { spatialBoundsValidator } from "../../forms/SpatialBoundsField";
import MinMaxZoomField, {MinMax} from '../../components/MinMaxZoomField';


interface Props {
  currentWmsLayer?: any, //RasterLayerFromAPI,
  // rasterSources?: RasterSourceFromAPI[] | null,
};

interface PropsFromDispatch {
  // removeRasterSourceUUID: () => void,
  // addNotification: (message: string | number, timeout: number) => void,
};

const WmsLayerForm: React.FC<Props & PropsFromDispatch & RouteComponentProps> = (props) => {
  const { currentWmsLayer} = props;
  const organisationsToSharedWith = useSelector(getOrganisations).availableForRasterSharedWith;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  // const observationTypes = useSelector(getObservationTypes).available;
  // const colorMaps = useSelector(getColorMaps).available;
  const datasets = useSelector(getDatasets).available;
  // const rasterSourceUUID = useSelector(getRasterSourceUUID);

  // useEffect(() => {
  //   return () => {
  //     removeRasterSourceUUID();
  //   };
  // }, [removeRasterSourceUUID]);

  const initialValues = currentWmsLayer ? {
    name: currentWmsLayer.name,
    description: currentWmsLayer.description,
    datasets: currentWmsLayer.datasets.map((dataset:any)=>dataset.slug),
    wmsUrl: currentWmsLayer.wms_url,
    slug: currentWmsLayer.slug,
    downloadUrl: currentWmsLayer.download_url,
    legendUrl: currentWmsLayer.legend_url,
    getFeatureInfoUrl: currentWmsLayer.get_feature_info_url,
    tiled: currentWmsLayer.tiled,
    minMaxZoom: {
      minZoom: currentWmsLayer.min_zoom + '',
      maxZoom: currentWmsLayer.max_zoom + '',
    },
    spatialBounds: currentWmsLayer.spatial_bounds,
    options: JSON.stringify(currentWmsLayer.options),
    // rasterSource: (currentWmsLayer.raster_sources && currentWmsLayer.raster_sources[0] && getUuidFromUrl(currentWmsLayer.raster_sources[0])) || null,
    // aggregationType: currentWmsLayer.aggregation_type || null,
    // observationType: (currentWmsLayer.observation_type && currentWmsLayer.observation_type.id + '') || null,
    // colorMap: {options: currentWmsLayer.options, rescalable: currentWmsLayer.rescalable},
    accessModifier: currentWmsLayer.access_modifier,
    sharedWith: currentWmsLayer.shared_with.length === 0 ? false : true,
    organisationsToSharedWith: currentWmsLayer.shared_with.map((organisation:any) => organisation.uuid.replace(/-/g, "")) || [],
    organisation: currentWmsLayer.organisation.uuid.replace(/-/g, "") || null,
    supplier: currentWmsLayer.supplier,
  } : {
    name: null,
    description: null,
    datasets: [],
    wmsUrl: "http://example.com",
    slug: "",
    downloadUrl: "",
    legendUrl: "",
    getFeatureInfoUrl: "",
    tiled: true,
    minMaxZoom: {
      minZoom: 0,
      maxZoom: 31,
    },
    spatialBounds: null,
    options: '{"transparent": "True"}',
    // rasterSource: rasterSourceUUID || null,
    // aggregationType: null,
    // observationType: null,
    // colorMap: null,
    accessModifier: 'Private',
    sharedWith: false,
    organisationsToSharedWith: [],
    organisation: selectedOrganisation.uuid.replace(/-/g, "") || null,
    supplier: null,
  };
  const onSubmit = (values: Values) => {
    console.log('submitted', values);

    const wmsLayer = {
      name: values.name + '',
      slug: values.name + '',
      get_feature_info:false,
      description: values.description + '',
      datasets: values.datasets,
      wms_url: values.wmsUrl + '',
      download_url: values.downloadUrl + '',
      legend_url: values.legendUrl + '',
      get_feature_info_url: values.getFeatureInfoUrl + '',
      tiled: values.tiled,
      // @ts-ignore
      min_zoom: values.minMaxZoom.minZoom,
      // @ts-ignore
      max_zoom: values.minMaxZoom.maxZoom,
      spatial_bounds: values.spatialBounds,
      options: JSON.stringify({"transparent": "True"}), //JSON.stringify(values.options),
      accessModifier: values.accessModifier,
      // @ts-ignore
      shared_with: values.organisationsToSharedWith.map((organisation:any) => organisation.replace(/-/g, "")),
      organisation: ((values.organisation + '').replace(/-/g, "")) + '' || null,
      supplier: values.supplier,
    };

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
          .then((preresponse:any) => preresponse.json())
          .then((response:any) => {
            const status = response.status;
            // props.addNotification(status, 2000);
            if (status === 201) {
              // redirect back to the table of raster layers
              props.history.push('/data_management/wms_layers');
            } else {
              console.error(response);
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
        .then((preresponse:any) => preresponse.json())
        .then((data:any) => {
          const status = data.response.status;
          // props.addNotification(status, 2000);
          if (status === 200) {
            // redirect back to the table of raster layers
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

  return (
    <ExplainSideColumn
      imgUrl={wmsIcon}
      headerText={"WMS Layers"}
      explainationText={"WMS-Layers allow to configure layers in lizard even if they are hosted on another platform"} 
      backUrl={"/data_management"}
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
          placeholder={'This is a layer based on raster_source'}
          value={values.description as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
        />
        {/* <SelectBox
          title={'Dataset'}
          name={'dataset'}
          placeholder={'- Select -'}
          value={values.dataset as string}
          valueChanged={value => handleValueChange('dataset', value)}
          choices={datasets.map((dataset: any) => [dataset.slug, dataset.slug])}
          validated
        /> */}
        <SlushBucket
          title={'Datasets'}
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
            console.log("datasets 123", value);
            handleValueChange('datasets', value)
          }}
          validated
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        {/* wmsUrl: "",
        downloadUrl: "",
        legendUrl: "",
        getFeatureInfoUrl: "",
        tiled: true,
        minMaxZoom: {
          minZoom: "",
          maxZoom: "",
        },
        spatialBounds: null,
        options: {}, */}
        <TextInput
          title={'WMS Url *'}
          name={'wmsUrl'}
          placeholder={'http://example.com'}
          value={values.wmsUrl as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.wmsUrl as string)}
          errorMessage={minLength(3, values.wmsUrl as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Slug'}
          name={'slug'}
          placeholder={'Slug for this WMS'}
          value={values.slug as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          // errorMessage={minLength(3, values.wmsUrl as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Download Url *'}
          name={'downloadUrl'}
          placeholder={'http://example.com'}
          value={values.downloadUrl as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          // errorMessage={minLength(3, values.name as string)}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Legend Url *'}
          name={'legendUrl'}
          placeholder={'http://example.com'}
          value={values.legendUrl as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          triedToSubmit={triedToSubmit}
        />
        <TextInput
          title={'Get Feature Url *'}
          name={'getFeatureInfoUrl'}
          placeholder={'http://example.com'}
          value={values.getFeatureInfoUrl as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={true}
          triedToSubmit={triedToSubmit}
        />
        <CheckBox
          title={'Tiled'}
          name={'tiled'}
          value={values.tiled as boolean}
          valueChanged={bool => handleValueChange('tiled', bool)}
          // readonly={!!currentRasterSource}
        />
        <MinMaxZoomField
          // title={'Get Feature Url *'}
          name={'minMaxZoom'}
          // placeholder={'http://example.com'}
          value={values.minMaxZoom}
          // valueChanged={handleInputChange}
          valueChanged={(value:MinMax) => handleValueChange('minMaxZoom', value)}
          clearInput={clearInput}
          // validated={!minLength(3, values.name as string)}
          // errorMessage={minLength(3, values.name as string)}
          triedToSubmit={triedToSubmit}
        />
        <SpatialBoundsField
           name={'spatialBounds'}
           // placeholder={'http://example.com'}
           // @ts-ignore
           value={values.spatialBounds}
           // valueChanged={handleInputChange}
           valueChanged={(value:any) => handleValueChange('spatialBounds', value)}
           clearInput={clearInput}
           // validated={!minLength(3, values.name as string)}
           // errorMessage={minLength(3, values.name as string)}
           triedToSubmit={triedToSubmit}
          // @ts-ignore
           otherValues= {{
            wmsLayerName: values.name + '',
            wmsLayerSlug: values.slug + '',
            wmsLayerUrl: values.wmsUrl + '',
           }}
           // valueChanged: Function,
           geoServerError={false}
           showGeoServerError={()=>{}}
          
           // name="wmsLayerSpatialBounds"
           // title={<FormattedMessage id="wms_layer_form.spatial_bounds" />}
           // subtitle={<FormattedMessage id="wms_layer_form.add_spatial_bounds" />}
           // initial = {
           //   (
           //     currentWmsLayer &&
           //     currentWmsLayer.spatial_bounds
           //   ) || null
           // }
           // validators={[spatialBoundsValidator]}
           // geoServerError={this.state.geoServerError}
           // showGeoServerError={this.showGeoServerError}
        />
        <TextArea
          title={'Options (JSON)'}
          name={'options'}
          placeholder={'This is a layer based on raster_source'}
          value={values.options as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={(()=>{
            // console.log('JSON.parse 1')
            try{
              // console.log('JSON.parse 2')
              JSON.parse(values.options as string)
            } catch(e) {
              // console.log('JSON.parse 3')
              return false;
            }
            // console.log('JSON.parse 4')
            return true;
          })()}
        />
        <span className={formStyles.FormFieldTitle}>
          3: Rights
        </span>
        <AccessModifier
          title={'Access Modifier'}
          name={'accessModifier'}
          value={values.accessModifier as string}
          valueChanged={value => handleValueChange('accessModifier', value)}
          readOnly
        />
        <CheckBox
          title={'Shared with other organisations'}
          name={'sharedWith'}
          value={values.sharedWith as boolean}
          valueChanged={bool => handleValueChange('sharedWith', bool)}
        />
        {values.sharedWith ? (
          <SlushBucket
            title={'Organisations'}
            name={'organisationsToSharedWith'}
            placeholder={'Search organisations'}
            value={values.organisationsToSharedWith as string[]}
            choices={organisationsToSharedWith.map((organisation: any) => {
              return {
                display: organisation.name,
                value: organisation.uuid
              }
            })}
            valueChanged={(value: any) => handleValueChange('organisationsToSharedWith', value)}
            validated
          />
        ) : null}
        <SelectBox
          title={'Organisation'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation as string}
          valueChanged={value => handleValueChange('organisation', value)}
          choices={organisations.map((organisation: any) => [organisation.uuid, organisation.name])}
          validated
          readOnly
        />
        <TextInput
          title={'Supplier'}
          name={'supplier'}
          value={values.supplierName as string}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          readOnly
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
  removeRasterSourceUUID: () => dispatch(removeRasterSourceUUID()),
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
});

export default WmsLayerForm; //connect(null, mapDispatchToProps)(withRouter(WmsLayerForm));