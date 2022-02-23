import { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect, useSelector } from 'react-redux';
import { AppDispatch } from '../..';
import { createRasterSource, patchRasterSource, RasterSourceFromAPI } from '../../api/rasters';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { CheckBox } from './../../form/CheckBox';
import { DurationField, durationValidator } from './../../form/DurationField';
import { TextArea } from './../../form/TextArea';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { SelectDropdown } from '../../form/SelectDropdown';
import { AcceptedFile, UploadData } from '../../form/UploadData';
import { getOrganisations, getSelectedOrganisation} from '../../reducers';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { AccessModifier } from '../../form/AccessModifier';
import { rasterIntervalStringServerToDurationObject, toISOValue } from '../../utils/isoUtils';
import { addFilesToQueue, addNotification, updateRasterSourceUUID, openCloseUploadQueueModal } from '../../actions';
import { sendDataToLizardRecursive } from '../../utils/sendDataToLizard';
import { rasterSourceFormHelpText } from '../../utils/help_texts/helpTextForRasters';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { baseUrl } from './RasterSourceTable';
import Modal from '../../components/Modal';
import FormActionButtons from '../../components/FormActionButtons';
import DeleteModal from '../../components/DeleteModal';
import rasterSourceIcon from "../../images/raster_source_icon.svg";
import formStyles from './../../styles/Forms.module.css';
import DeleteRasterSourceNotAllowed from './DeleteRasterSourceNotAllowed';
import DataFlushingModal from './DataFlushingModal';
import TemporalDataFlushingModal from './TemporalDataFlushingModal';

interface Props {
  currentRecord?: RasterSourceFromAPI
};
interface RouteParams {
  uuid: string;
};

// Helper function to fetch suppliers in async select dropdown
export const fetchSuppliers = async (uuid: string, searchInput: string) => {
  const params=["role=supplier", "page_size=20"];

  if (searchInput) params.push(`username__icontains=${searchInput}`);
  const urlQuery = params.join('&');

  const response = await fetch(`/api/v4/organisations/${uuid}/users/?${urlQuery}`, {
    credentials: 'same-origin'
  });
  const responseJSON = await response.json();

  return responseJSON.results.map((supplier: any) => convertToSelectObject(supplier.id, supplier.username));
};

const RasterSourceForm: React.FC<Props & DispatchProps & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord } = props;
  const organisations = useSelector(getOrganisations).available;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const organisationsToSwitchTo = organisations.filter(org => org.roles.includes('admin'));
  const [rasterCreatedModal, setRasterCreatedModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDataFlushingModal, setShowDataFlushingModal] = useState<boolean>(false);
  const [temporalDataFlushingModal, setTemporalDataFlushingModal] = useState<boolean>(false);

  const initialValues = currentRecord ? {
    name: currentRecord.name,
    uuid: currentRecord.uuid,
    description: currentRecord.description,
    supplierCode: currentRecord.supplier_code,
    supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
    temporal: currentRecord.temporal,
    interval: currentRecord.interval ? toISOValue(rasterIntervalStringServerToDurationObject(currentRecord.interval)) : '',
    accessModifier: currentRecord.access_modifier,
    organisation: currentRecord.organisation ? convertToSelectObject(currentRecord.organisation.uuid, currentRecord.organisation.name) : null,
    data: [],
  } : {
    name: null,
    description: null,
    supplierCode: null,
    supplier: null,
    temporal: false,
    interval: null,
    accessModifier: 'Private',
    organisation: selectedOrganisation ? convertToSelectObject(selectedOrganisation.uuid, selectedOrganisation.name) : null,
    data: []
  };

  const onSubmit = (values: Values) => {
    if (!currentRecord) {
      const rasterSource = {
        name: values.name,
        organisation: values.organisation && values.organisation.value,
        access_modifier: values.accessModifier,
        description: values.description,
        supplier: values.supplier && values.supplier.label,
        supplier_code: values.supplierCode,
        temporal: values.temporal,
        interval: values.interval,
      };
      createRasterSource(rasterSource)
        .then(response => {
          const status = response.status;
          if (status === 201) {
            setRasterCreatedModal(true);
            return response.json();
          } else {
            console.error(response);
          }
        }).then(parsedBody => {
          props.updateRasterSourceUUID(parsedBody.uuid);
          // Add files to Upload Queue in Redux store
          // add notification and send data to Lizard server
          const acceptedFiles = values.data as AcceptedFile[];
          const uploadFiles = acceptedFiles.map(f => f.file);
          if (uploadFiles.length > 0) props.addNotification('Upload started', 1000);
          props.addFilesToQueue(uploadFiles);
          props.openCloseUploadQueueModal(true);
          sendDataToLizardRecursive(
            parsedBody.uuid,
            values.data,
            values.temporal
          );
        }).catch(e => console.error(e));
    } else {
      const body = {
        name: values.name,
        organisation: values.organisation && values.organisation.value,
        access_modifier: values.accessModifier,
        description: values.description,
        supplier: values.supplier && values.supplier.label,
        supplier_code: values.supplierCode,
        temporal: values.temporal,
        interval: values.interval,
      };
      patchRasterSource(currentRecord.uuid as string, body)
        .then(data => {
          const status = data.response.status;
          if (status === 200) {
            props.addNotification('Success! Raster source updated', 2000);
            // Add files to Upload Queue in Redux store
            // add notification and send data to Lizard server
            const acceptedFiles = values.data as AcceptedFile[] || [];
            const uploadFiles = acceptedFiles.map(f => f.file);
            if (uploadFiles.length > 0) props.addNotification('Upload started', 1000);
            props.addFilesToQueue(uploadFiles);
            props.openCloseUploadQueueModal(true);
            sendDataToLizardRecursive(
              props.match.params.uuid,
              values.data,
              values.temporal
            );
            // redirect back to the table of raster sources
            props.history.push('/management/data_management/rasters/sources')
          } else {
            props.addNotification(status, 2000);
            console.error(data);
          };
        })
        .catch(e => console.error(e));
    }
  };

  const {
    values,
    triedToSubmit,
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
      imgUrl={rasterSourceIcon}
      imgAltDescription={"Raster-Source icon"}
      headerText={"Raster Sources"}
      explanationText={rasterSourceFormHelpText[fieldOnFocus] || rasterSourceFormHelpText['default']}
      backUrl={"/management/data_management/rasters/sources"}
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
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
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
          validated={true}
        />
        <TextInput
          title={'FTP / Supplier code'}
          name={'supplierCode'}
          value={values.supplierCode}
          valueChanged={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          clearInput={clearInput}
          validated={true}
        />
        <span className={formStyles.FormFieldTitle}>
          2: Data
        </span>
        <CheckBox
          title={'Temporal'}
          name={'temporal'}
          value={values.temporal}
          valueChanged={bool => handleValueChange('temporal', bool)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!!currentRecord}
        />
        <DurationField
          title={'Interval'}
          name={'interval'}
          value={values.interval}
          valueChanged={value => handleValueChange('interval', value)}
          validated={values.temporal ? !durationValidator(values.interval, true) : true}
          errorMessage={durationValidator(values.interval, true)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={!!currentRecord || values.temporal === false}
        />
        <UploadData
          title={'Data'}
          name={'data'}
          temporal={values.temporal}
          fileTypes={["image/tiff", ".geotiff"]}
          data={values.data}
          setData={data => handleValueChange('data', data)}
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
          readOnly={!!currentRecord}
        />
        <SelectDropdown
          title={'Organisation *'}
          name={'organisation'}
          placeholder={'- Search and select -'}
          value={values.organisation}
          valueChanged={value => handleValueChange('organisation', value)}
          options={organisations.map(organisation => convertToSelectObject(organisation.uuid, organisation.name))}
          validated={values.organisation !== null && values.organisation !== ''}
          errorMessage={'Please select an organisation'}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={
            !selectedOrganisation? true:
            !(!currentRecord && organisationsToSwitchTo.length > 0 && selectedOrganisation.roles.includes('admin'))
          }
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
          loadOptions={
            selectedOrganisation? searchInput => fetchSuppliers(selectedOrganisation.uuid, searchInput) :
            undefined
          }
          readOnly={
            !selectedOrganisation? true:
            !selectedOrganisation.roles.includes('admin')
          }
          dropUp
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div
          className={formStyles.ButtonContainer}
        >
          <CancelButton
            url={'/management/data_management/rasters/sources'}
          />
          <div style={{display: "flex"}}>
            {currentRecord ? (
              <div style={{ marginRight: 16 }}>
                <FormActionButtons
                  actions={currentRecord.temporal ? [
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true)
                    },
                    {
                      displayValue: "Flush data",
                      actionFunction: () => setShowDataFlushingModal(true)
                    },
                    {
                      displayValue: "Flush range",
                      actionFunction: () => setTemporalDataFlushingModal(true)
                    },
                  ] : [
                    {
                      displayValue: "Delete",
                      actionFunction: () => setShowDeleteModal(true)
                    },
                    {
                      displayValue: "Flush data",
                      actionFunction: () => setShowDataFlushingModal(true)
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
      {rasterCreatedModal ? (
        <Modal
          title={'Raster created'}
          buttonConfirmName={'Continue'}
          onClickButtonConfirm={() => props.history.push('/management/data_management/rasters/layers/new')}
        >
          <p>A layer is needed to view the raster in the portal.</p>
          <p>We automatically created a layer for you to compose. You will now be redirected to the layer management.</p>
        </Modal>
      ) : null}
      {showDeleteModal && currentRecord && currentRecord.layers.length === 0 && currentRecord.labeltypes.length === 0 ? (
        <DeleteModal
          rows={[currentRecord]}
          displayContent={[{name: "name", width: 65}, {name: "uuid", width: 35}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={'/management/data_management/rasters/sources'}
        />
      ) : null}
      {showDeleteModal && currentRecord && (currentRecord.layers.length !== 0 || currentRecord.labeltypes.length !== 0) ? (
        <DeleteRasterSourceNotAllowed
          handleClose={() => setShowDeleteModal(false)}
          rowToBeDeleted={currentRecord}
        />
      ) : null}
      {currentRecord && showDataFlushingModal ? (
        <DataFlushingModal
          row={currentRecord}
          displayContent={[{name: "name", width: 50}, {name: "uuid", width: 50}]}
          handleClose={() => setShowDataFlushingModal(false)}
        />
      ) : null}
      {currentRecord && currentRecord.temporal && temporalDataFlushingModal ? (
        <TemporalDataFlushingModal
          row={currentRecord}
          handleClose={() => setTemporalDataFlushingModal(false)}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: AppDispatch) => ({
  updateRasterSourceUUID: (uuid: string) => dispatch(updateRasterSourceUUID(uuid)),
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout)),
  addFilesToQueue: (files: File[]) => dispatch(addFilesToQueue(files)),
  openCloseUploadQueueModal: (isOpen: boolean) => dispatch(openCloseUploadQueueModal(isOpen)),
});
type DispatchProps = ReturnType<typeof mapPropsToDispatch>;

export default connect(null, mapPropsToDispatch)(withRouter(RasterSourceForm));