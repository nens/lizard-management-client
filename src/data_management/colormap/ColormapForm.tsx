import React from 'react';
import {useState,}  from 'react';
// import { RouteComponentProps, withRouter } from 'react-router';
// import { connect, useSelector } from 'react-redux';
import { TextInput } from './../../form/TextInput';
import { TextArea } from './../../form/TextArea';
import { IntegerInput } from './../../form/IntegerInput';
import { SubmitButton } from '../../form/SubmitButton';
import { CustomRadioSelect } from '../../form/CustomRadioSelect';
import { ColormapAllSteps, ColormapStep, ColormapStepApi, toApiColorMapStep, colorMapStepApiToColormapStep } from '../../form/ColormapAllSteps';
import { useForm, Values } from '../../form/useForm';
import { minLength } from '../../form/validators';
// import { addNotification } from '../../actions';
import styles from './ColormapForm.module.css';

import formStyles from './../../styles/Forms.module.css';
import buttonStyles from "../../styles/Buttons.module.css";

interface ColomapObj {
  type: string,
  data: ColormapStepApi[],
  // log: boolean,
  // name: string,
  // description: string,
  // rescalable: boolean,
  labels: any[],
  free?: boolean,
  invalid?: ColormapStepApi,
}

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

  const [stepLengthFieldIsEmpty, setStepLengthFieldIsEmpty] = useState<boolean>(false);

  const initialValues = currentRecord? {
    name: currentRecord.name || '',
    description: currentRecord.description || '',
    data: (currentRecord.data || []).map(colorMapStepApiToColormapStep),
    type: currentRecord.log? "Logarithmic": currentRecord.type || "GradientColormap",
    rescalable: currentRecord.rescalable === true,
    labels: currentRecord.labels,
    invalid: currentRecord.invalid,
    free: currentRecord.free,
  }
  :
  {
    name: null,
    description: null,
    data: [
      {
        step: 0,
        rgba: {r:255, g:255, b:255, a:1},
        label: "",
      },
      {
        step: 1,
        rgba: {r:0, g:255, b:100, a:1},
        label: "",
      },
    ],
    type: "GradientColormap",
    rescalable: true,
  };

  /*
  {"data": [[0, [255, 255, 255, 255]], [1, [0, 255, 100, 255]], [2, [255, 0, 186, 255]], [3, [0, 27, 255, 255]]], "type": "DiscreteColormap", "labels": {"nl_NL": [[0, "BAG - woonfunctie"], [1, "BAG - celfunctie"], [2, "BAG - industriefunctie"], [3, "BAG - industriefunctie"]]}, "invalid": [7, 255, 255, 255]}
  //*/
  /*
[0.0, [255, 255, 204, 0]], [0.125, [255, 237, 160, 255]], [0.25, [254, 217, 118, 255]], [0.375, [254, 178, 76, 255]], [0.5, [253, 141, 60, 255]], [0.625, [252, 78, 42, 255]], [0.75, [227, 26, 28, 255]], [0.875, [189, 0, 38, 255]], [1.0, [128, 0, 38, 255]]
  //*/

  const onSubmit = (values: Values) => {
    let jsonObj:ColomapObj = {
      // log: false,
      data: [],
      type: values.type,
      // name: values.name,
      // description: values.description,
      // rescalable: values.rescalable,
      labels: values.labels,
    };
    if (values.free === true || values.free === false) {
      jsonObj.free = jsonObj.free;
    }
    if (values.invalid) {
      jsonObj.invalid = values.invalid;
    }
    if (values.type === "Logarithmic" ) {
      jsonObj.type = "GradientColormap";
      // the api seems to only accept a "log" field if log:true ... nah
      // @ts-ignore
      jsonObj.log = true;
    }
    jsonObj.data = values.data.map(toApiColorMapStep);

    confirmAction(jsonObj);
  }

  const {
    values,
    triedToSubmit,
    formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleValueChanges,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
      <form
        className={`${formStyles.Form} ${styles.Form}`}
        onSubmit={handleSubmit}
        onReset={handleReset}
        style={{
          // reset form styles that are not applicable in modal
          margin: 0,
          padding: 0,
        }}
      >
        <div>
          {/* <div>
            <TextInput
              title={'Name'}
              name={'name'}
              value={values.name}
              valueChanged={handleInputChange}
              clearInput={clearInput}
              validated={!minLength(2, values.name)}
              errorMessage={minLength(2, values.name)}
              triedToSubmit={triedToSubmit}
            />
            <TextArea
              title={'Description'}
              name={'description'}
              value={values.description}
              valueChanged={handleInputChange}
              clearInput={clearInput}
              validated
            />
          </div> */}
          {/* <div> */}
            <CustomRadioSelect
              title="Colormap Type"
              name="type"
              value={values.type}
              valueChanged={(event)=>{
                if (event.target.value === 'DiscreteColormap') {
                  handleInputChange(event);
                } else {
                  handleValueChanges([{name: "invalid", value: undefined}, {name: "labels", value: undefined}, {name: "type", value: event.target.value}]);
                }
              }}
              readonly={false}
              options={[
                {
                value: "DiscreteColormap",
                component: (
                  <div className={styles.TypeLabel}>
                    <div style={{display:"flex"}}>
                      <div style={{backgroundColor: "#43E669", width: "33%"}}></div>
                      <div style={{backgroundColor: "#F95959", width: "33%"}}></div>
                      <div style={{backgroundColor: "#8A6EFF", width: "33%"}}></div>
                    </div>
                    <div>Discreet</div>
                  </div>
                  ),
                selectedComponent: (
                  <div className={`${styles.TypeLabel} ${styles.TypeLabelSelected}`}>
                    <div style={{display:"flex"}}>
                      <div style={{backgroundColor: "#43E669", width: "33%"}}></div>
                      <div style={{backgroundColor: "#F95959", width: "33%"}}></div>
                      <div style={{backgroundColor: "#8A6EFF", width: "33%"}}></div>
                    </div>
                    <div>Discreet</div>
                  </div>
                  ),
                },
                {
                  value: "GradientColormap",
                  component: (
                    <div className={styles.TypeLabel}>
                      <div style={{background: "transparent linear-gradient(90deg, #6E5757 0%, #C8E2EC 0%, #4247EC 100%) 0% 0% no-repeat padding-box",}}></div>
                      <div>Lineair Gradient</div>
                    </div>
                    ),
                  selectedComponent: (
                    <div className={`${styles.TypeLabel} ${styles.TypeLabelSelected}`}>
                      <div style={{background: "transparent linear-gradient(90deg, #6E5757 0%, #C8E2EC 0%, #4247EC 100%) 0% 0% no-repeat padding-box",}}></div>
                      <div>Lineair Gradient</div>
                    </div>
                    ),
                },
                {
                  value: "Logarithmic",
                  component: (
                    <div className={styles.TypeLabel}>
                      <div style={{background: "transparent linear-gradient(90deg, #6E5757 0%, #FFF67A 0%, #FFD153 56%, #FF2E2E 89%, #6D1600 100%) 0% 0% no-repeat padding-box",}}></div>
                      <div>Logarithmic</div>
                    </div>
                    ),
                  selectedComponent: (
                    <div className={`${styles.TypeLabel} ${styles.TypeLabelSelected}`}>
                      <div style={{background: "transparent linear-gradient(90deg, #6E5757 0%, #FFF67A 0%, #FFD153 56%, #FF2E2E 89%, #6D1600 100%) 0% 0% no-repeat padding-box",}}></div>
                      <div>Logarithmic</div>
                    </div>
                    ),
                },
              ]}
            ></CustomRadioSelect>
            {/* <label>Colormap Steps</label>
            <br/> */}
            <IntegerInput
              title="Colormap Steps"
              name={"data"}
              // type="number"
              validated={true}
              valueChanged={e => {
                // e.persist();
                const newLength = parseInt(e.target.value);
                if (!newLength) {
                  setStepLengthFieldIsEmpty(true);
                  return;
                }
                setStepLengthFieldIsEmpty(false);
                const oldLength = values.data.length;
                const difference = newLength - oldLength;
                if (difference === 0) {
                  return;
                } else if (difference > 0) {
                  const tempArray = Array(difference).fill({
                    step: values.data[oldLength-1].step,
                    rgba: values.data[oldLength-1].rgba,
                    label: "",
                  });
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
              value={stepLengthFieldIsEmpty? "" :(values.data && values.data.length) || 0}
              // placeholder={placeholderMinimumColorRange}
              // className={formStyles.FormControl}
              // readOnly={readOnly}
              // disabled={readOnly}
            />
            <div>
              <ColormapAllSteps
                title={"Colormap Values"}
                steps={values.data}
                onChange={((event:any)=>{
                  handleInputChange(event);
                })}
                name={"data"}
                colormapIsLogarithmic={values.type === "Logarithmic"}
                colormapIsDiscrete={values.type === "DiscreteColormap"}
              ></ColormapAllSteps>
              {/* {values.data.map((item:any)=>{
                return (
                  <div>{item +""}</div>
                );
              })} */}
            </div>
          {/* </div> */}
        </div>
        
        <div
          className={formStyles.ButtonContainer}
        >
          <button
            className={buttonStyles.ButtonLink}
            onClick={cancelAction}
            type="button"
          >
            CANCEL
          </button>
          <SubmitButton
            onClick={()=>{tryToSubmitForm()}}
          />
        </div>
      </form>
  );
};

// const mapPropsToDispatch = (dispatch: any) => ({
//   addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
// });

// const ColormapForm = connect(null, mapPropsToDispatch)(withRouter(ColormapModel));

export { ColormapForm };