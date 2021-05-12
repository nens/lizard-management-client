import React, {useState,} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
// import { SubmitButton } from '../../form/SubmitButton';
// import { CancelButton } from '../../form/CancelButton';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { addNotification } from '../../actions';
import formStyles from './../../styles/Forms.module.css';
import { TextArea } from './../../form/TextArea';
import labeltypesIcon from "../../images/labeltypes_icon.svg";
import FormActionButtons from '../../components/FormActionButtons';
import DeleteModal from '../../components/DeleteModal';
import { lableTypeFormHelpText } from '../../utils/help_texts/helpTextForLabelTypes';

interface Props {
  currentRecord: any
};
interface PropsFromDispatch {
  addNotification: (message: string | number, timeout: number) => void
};
interface RouteParams {
  uuid: string;
};

const fetchLabelTypesWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map (uuid => {
    return fetch('/api/v3/labeltypes/' + uuid + "/", fetchOptions);
  });
  return Promise.all(fetches);
};

const LabeltypeModel: React.FC<Props & PropsFromDispatch & RouteComponentProps<RouteParams>> = (props) => {
  const { currentRecord } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialValues = {
    name: currentRecord.name || '',
    uuid: currentRecord.uuid || '',
    description: currentRecord.description || '',
    organisation: currentRecord.organisation.name || '',
  };

  const onSubmit = (values: Values) => {
    // const body = {
    //   name: values.name,
    //   description: values.description,
  //     organisation: values.organisation.unique_id,
  //     object_type: values.object_type,
    // };

    // fetch(`/api/v3/labeltypes/${currentRecord.uuid}/`, {
    //   credentials: 'same-origin',
    //   method: 'PATCH',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify(body)
    // })
    //   .then(data => {
    //     const status = data.status;
    //     if (status === 200) {
    //       props.addNotification('Success! Labeltype updated', 2000);
    //       props.history.push('/data_management/labels/labeltypes/');
    //     } else {
    //       props.addNotification(status, 2000);
    //       console.error(data);
    //     };
    //   })
    //   .catch(console.error);
  };

  // dummie function to test creation
  // const onCreate = () => {
  //   const body = {
  //     name: "test labeltype",
  //     description: "test labeltype",
  //     organisation: currentRecord.organisation.unique_id,
  //     object_type: currentRecord.object_type,
  //   };

  //   fetch(`/api/v3/labeltypes/`, {
  //     credentials: 'same-origin',
  //     method: 'POST',
  //     headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify(body)
  //   })
  //     .then(data => {
  //       const status = data.status;
  //       if (status === 201) {
  //         props.addNotification('Success! Labeltype created', 2000);
  //         props.history.push('/data_management/labels/labeltypes/');
  //       } else {
  //         props.addNotification(status, 2000);
  //         console.error(data);
  //       };
  //     })
  //     .catch(console.error);
  // }

  const {
    values,
    triedToSubmit,
    // formSubmitted,
    // tryToSubmitForm,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit});

  return (
    <ExplainSideColumn
      imgUrl={labeltypesIcon}
      imgAltDescription={"Label-types icon"}
      headerText={"Label types"}
      explanationText={lableTypeFormHelpText[fieldOnFocus] || lableTypeFormHelpText['default']}
      backUrl={"/data_management/labels/label_types/"}
      fieldName={fieldOnFocus}
    >
      <form
        className={formStyles.Form}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <TextInput
          title={'Name'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(3, values.name)}
          errorMessage={minLength(3, values.name)}
          triedToSubmit={triedToSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
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
        <TextArea
          title={'Description'}
          name={'description'}
          placeholder={'Description here..'}
          value={values.description}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={true}
        />
        <TextInput
          title={'Organisation'}
          name={'organisation'}
          value={values.organisation}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly
        />
        <div
          className={formStyles.ButtonContainer}
        >
          { currentRecord?
          <div
            style={{marginLeft: "auto"}}
          >
            <FormActionButtons
              actions={[
                {
                  displayValue: "Delete",
                  actionFunction: () => {setShowDeleteModal(true);}
                },
                // {
                //   displayValue: "Create",
                //   actionFunction: onCreate,
                // }
              ]}
            />
          </div>
          :null}
          
        </div>
      </form>
      {currentRecord && showDeleteModal ? (
        <DeleteModal
          rows={[currentRecord]}
          displayContent={[{name: "name", width: 65}, {name: "prefix", width: 35}]}
          fetchFunction={fetchLabelTypesWithOptions}
          handleClose={() => setShowDeleteModal(false)}
          tableUrl={'/data_management/labels/label_types'}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

const LabeltypeForm = connect(null, mapPropsToDispatch)(withRouter(LabeltypeModel));

export { LabeltypeForm };