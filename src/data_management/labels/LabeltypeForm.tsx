import { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { AppDispatch } from '../..';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { TextInput } from './../../form/TextInput';
// import { SubmitButton } from '../../form/SubmitButton';
// import { CancelButton } from '../../form/CancelButton';
import { useForm } from '../../form/useForm';
import { minLength } from '../../form/validators';
import { addNotification } from '../../actions';
import formStyles from './../../styles/Forms.module.css';
import { TextArea } from './../../form/TextArea';
import labeltypesIcon from "../../images/labeltypes_icon.svg";
import FormActionButtons from '../../components/FormActionButtons';
import DeleteModal from '../../components/DeleteModal';
import { lableTypeFormHelpText } from '../../utils/help_texts/helpTextForLabelTypes';
import { LabelType } from '../../types/labelType';

interface Props {
  currentRecord: LabelType
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
    name: currentRecord.name,
    description: currentRecord.description || '',
    organisation: currentRecord.organisation.name || '',
  };

  const {
    values,
    triedToSubmit,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
    fieldOnFocus,
    handleBlur,
    handleFocus,
  } = useForm({initialValues, onSubmit: () => null});

  return (
    <ExplainSideColumn
      imgUrl={labeltypesIcon}
      imgAltDescription={"Label-types icon"}
      headerText={"Label types"}
      explanationText={lableTypeFormHelpText[fieldOnFocus] || lableTypeFormHelpText['default']}
      backUrl={"/management/data_management/labels/label_types/"}
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
        {currentRecord ? (
          <TextInput
            title={'UUID'}
            name={'uuid'}
            value={currentRecord.uuid}
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
          tableUrl={'/management/data_management/labels/label_types'}
        />
      ) : null}
    </ExplainSideColumn>
  );
};

const mapPropsToDispatch = (dispatch: AppDispatch) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});

const LabeltypeForm = connect(null, mapPropsToDispatch)(withRouter(LabeltypeModel));

export { LabeltypeForm };