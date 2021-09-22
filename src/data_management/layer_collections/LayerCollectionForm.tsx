import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
import { AccessModifier } from '../../form/AccessModifier';
import { SelectDropdown } from '../../form/SelectDropdown';
import { fetchSuppliers } from './../rasters/RasterSourceForm';
import { convertToSelectObject } from '../../utils/convertToSelectObject';
import { SubmitButton } from '../../form/SubmitButton';
import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { minLength, isNotLiteralStringNew } from '../../form/validators';
import { addNotification } from '../../actions';
import { getSelectedOrganisation } from '../../reducers';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { baseUrl } from './LayerCollectionsTable';
import FormActionButtons from '../../components/FormActionButtons';
import DeleteModal from '../../components/DeleteModal';
import formStyles from './../../styles/Forms.module.css';
import layerCollectionIcon from "../../images/layer_collection_icon.svg";
import { layerCollectionFormHelpText } from '../../utils/help_texts/helpTextForLayercollections';


interface Props {
  currentRecord?: any
};

const backUrl = "/management/data_management/layer_collections";

const LayerCollectionForm = (props: Props & DispatchProps & RouteComponentProps) => {
  const { currentRecord } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const initialValues = currentRecord ? {
    slug: currentRecord.slug,
    accessModifier: currentRecord.access_modifier,
    supplier: currentRecord.supplier ? convertToSelectObject(currentRecord.supplier) : null,
  } : {
    slug: null,
    accessModifier: 'Private',
    supplier: null
  };

  const onSubmit = (values: Values) => {
    const body = {
      slug: values.slug,
      supplier: values.supplier && values.supplier.label,
      access_modifier: values.accessModifier,
    };

    if (!currentRecord) {
      fetch("/api/v4/layercollections/", {
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
          props.addNotification('Success! New layer collection created', 2000);
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
      fetch(`/api/v4/layercollections/${currentRecord.slug}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      .then(response => {
        const status = response.status;
        if (status === 200) {
          props.addNotification('Success! Layer collection updated', 2000);
          props.history.push(backUrl);
        } else if (status === 400) {
          console.error(response);
          // we need to parse the response to json to read the message details in case of duplicate in slug name
          return response.json();
        } else {
          props.addNotification(status, 2000);
          console.error(response);
        }
      })
      .then(parsedRes => {
        if (!parsedRes) return;
        if (parsedRes.code && parsedRes.code === 20) { // code 20 from backend if the slug already existed
          props.addNotification(`${values.slug} is already in use. Please try another slug name.`, 5000);
        } else {
          props.addNotification(400, 2000); // add notification for status code 400
        };
      })
      .catch(console.error);
    };
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
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={layerCollectionIcon}
      imgAltDescription={"Network icon"}
      headerText={"Monitoring Networks"}
      explanationText={layerCollectionFormHelpText[fieldOnFocus] || layerCollectionFormHelpText['default']}
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
          title={'Slug *'}
          name={'slug'}
          placeholder={'Please enter at least 3 character'}
          value={values.slug}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.slug) && !isNotLiteralStringNew(values.slug)}
          errorMessage={minLength(3, values.slug) || isNotLiteralStringNew(values.slug)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
          
        <span className={formStyles.FormFieldTitle}>
          2: Rights
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
          dropUp
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
            {currentRecord ? (
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
      {currentRecord && showDeleteModal ? (
        <DeleteModal
          rows={[currentRecord]}
          displayContent={[{name: "slug", width: 100}]}
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

export default connect(null, mapPropsToDispatch)(withRouter(LayerCollectionForm));