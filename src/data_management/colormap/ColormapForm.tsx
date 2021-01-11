import React from 'react';
// import { RouteComponentProps, withRouter } from 'react-router';
// import { connect, useSelector } from 'react-redux';
import { TextInput } from './../../form/TextInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CustomRadioSelect } from '../../form/CustomRadioSelect';
import { ColormapAllSteps } from '../../form/ColormapAllSteps';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
// import { addNotification } from '../../actions';
import formStyles from './../../styles/Forms.module.css';
import buttonStyles from "../../styles/Buttons.module.css";


interface Props {
  currentRecord: any,
  cancelAction: () => void,
  confirmAction: (record:any) => void,
};
// interface PropsFromDispatch {
//   addNotification: (message: string | number, timeout: number) => void
// };
// interface RouteParams {
//   uuid: string;
// };

const ColormapForm: React.FC<Props> = (props) => {
  const { 
    currentRecord,
    cancelAction,
    confirmAction, 
  } = props;

  const initialValues = currentRecord? {
    name: currentRecord.name || '',
    description: currentRecord.description || '',
    data: currentRecord.data || [],
    type: currentRecord.type || "GradientColormap",
    rescalable: currentRecord.rescalable === true,
  }
  :
  {
    name: null,
    description: null,
    data: [[0.0, [255, 255, 255, 255]],[1.0, [0, 255, 100, 255]]],
    type: "GradientColormap",
    rescalable: true,
  };

  /*
[0.0, [255, 255, 204, 0]], [0.125, [255, 237, 160, 255]], [0.25, [254, 217, 118, 255]], [0.375, [254, 178, 76, 255]], [0.5, [253, 141, 60, 255]], [0.625, [252, 78, 42, 255]], [0.75, [227, 26, 28, 255]], [0.875, [189, 0, 38, 255]], [1.0, [128, 0, 38, 255]]
  //*/

  const onSubmit = (values: Values) => {

  }

  const {
    values,
    triedToSubmit,
    formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
      // <form
      //   className={formStyles.Form}
      //   onSubmit={handleSubmit}
      //   onReset={handleReset}
      // >
      <div>
        <TextInput
          title={'Name'}
          name={'name'}
          value={values.name}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated={!minLength(2, values.name)}
          errorMessage={minLength(2, values.name)}
          triedToSubmit={triedToSubmit}
          // readOnly={!scenarioOrganisation.roles.includes("admin") && !(username === currentScenario.username)}
        />
        <TextInput
          title={'Description'}
          name={'description'}
          value={values.description}
          valueChanged={handleInputChange}
          clearInput={clearInput}
          validated
          // readOnly
        />
        <CustomRadioSelect
          title="Colormap Type"
          name="type"
          value={values.type}
          valueChanged={handleInputChange}
          readonly={false}
          options={[
            {
            title: "Discreet",
            value: "Discreet",
            imgUrl: "1234",
            },
            {
              title: "Lineair Gradient",
              value: "GradientColormap",
              imgUrl: "1234",
            },
            {
              title: "Logarithmic",
              value: "Logarithmic",
              imgUrl: "1234",
            },
          ]}
        ></CustomRadioSelect>
        <input
          name={"data"}
          type="number"
          autoComplete="off"
          onChange={e => {
            // e.persist();
            const newLength = parseInt(e.target.value);
            // do nothing on NaN or 0
            if (!newLength) {
              return;
            }
            const oldLength = values.data.length;
            const difference = newLength - oldLength;
            if (difference === 0) {
              return;
            } else if (difference > 0) {
              const tempArray = Array(difference).fill([1,[255,255,255,255]]);
              const newArray = values.data.concat(tempArray);
              console.log("make data bigger", tempArray, newArray)
              const newEvent = {...e, target: {...e.target, value: newArray, name: e.target.name}}
              handleInputChange(newEvent);
            } else /*if (difference < 0)*/ {
              const newArray = values.data.filter((item:any,i:number)=>{ 
                if ((i+1) > (values.data.length + difference)) { // difference is negative so we add it
                  return false
                } 
                else {
                  return true 
                } 
                })
              const newEvent = {...e, target: {...e.target, value: newArray, name: e.target.name}}
              handleInputChange(newEvent);
            }
          }}
          value={(values.data && values.data.length) || 0}
          // placeholder={placeholderMinimumColorRange}
          className={formStyles.FormControl}
          // readOnly={readOnly}
          // disabled={readOnly}
        />
        <div>
          <ColormapAllSteps
            title={""}
            steps={values.data.map((dataRgb:any)=>{return {
              step: dataRgb[0],
              rgba: dataRgb[1],
              label: "",
            }})}
          ></ColormapAllSteps>
          {/* {values.data.map((item:any)=>{
            return (
              <div>{item +""}</div>
            );
          })} */}
        </div>
        <div
          className={formStyles.ButtonContainer}
        >
          <button
            className={buttonStyles.ButtonLink}
            onClick={cancelAction}
          >
            CANCEL
          </button>
          <SubmitButton
            onClick={()=>{}}
          />
        </div>
      </div>
      // </form>
  );
};

// const mapPropsToDispatch = (dispatch: any) => ({
//   addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
// });

// const ColormapForm = connect(null, mapPropsToDispatch)(withRouter(ColormapModel));

export { ColormapForm };