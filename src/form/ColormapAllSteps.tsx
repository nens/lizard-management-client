import React, { useState } from "react";
import styles from "./ColormapAllSteps.module.css";
import { ChromePicker, RGBColor } from 'react-color';
import { TextInput } from '../form/TextInput';
import formStyles from "../styles/Forms.module.css";



export interface ColormapStep {
  step: number,
  rgba: RGBColor,
  label: string,
}

export type ColormapStepApi = [number, [number,number,number, number]]

export const colorMapStepApiToColormapStep = (stepApi: ColormapStepApi) => {
  const step = stepApi[0];
  const rgbArray = stepApi[1];
  const rgba = {
    r: rgbArray[0],
    g: rgbArray[1],
    b: rgbArray[2],
    a: ((rgbArray[3]*1000000) / 255) / 1000000,
  };
  return {
    step: step,
    rgba: rgba,
    label: "",
  }
}

export const toApiColorMapStep = (colormapStep: ColormapStep) => {
  return [colormapStep.step, [colormapStep.rgba.r, colormapStep.rgba.g, colormapStep.rgba.b, (colormapStep.rgba.a === undefined? 255: (Math.round(colormapStep.rgba.a*255)))]]
}

interface Props {
  name: string,
  title: string | JSX.Element,
  steps: ColormapStep[],
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  colormapIsLogarithmic: boolean,
  colormapIsDiscrete: boolean,
};

export const ColormapAllSteps: React.FC<Props> = (props) => {

  const {
    title,
    steps,
    name,
    onChange,
    colormapIsLogarithmic,
    colormapIsDiscrete,
  } = props;

  const [visiblepickerIndex, setVisiblepickerIndex] = useState<null | number>(null);

  const handleColorChange=(color: RGBColor, ind: number) => {
    const oldSteps = JSON.parse(JSON.stringify(steps));
    oldSteps[ind].rgba = color;
    // const (event: as React.ChangeEvent<HTMLInputElement>) = {target:{name: name, value: oldSteps}}
    const event = {target:{name: name, value: oldSteps}}
    // @ts-ignore
    onChange(event);
  }

  // lateron we will need to support labels
  // const handleLabelChange = (event:React.ChangeEvent<HTMLInputElement>, ind:number)=>{
  //   const oldSteps = JSON.parse(JSON.stringify(steps));
  //   oldSteps[ind].label = event.target.value;
  //   // const (event: as React.ChangeEvent<HTMLInputElement>) = {target:{name: name, value: oldSteps}}
  //   const fakeEvent = {target:{name: name, value: oldSteps}}
  //   // @ts-ignore
  //   onChange(fakeEvent);
  // }
  const handleStepChange = (event:React.ChangeEvent<HTMLInputElement>, ind:number)=>{
    const oldSteps = JSON.parse(JSON.stringify(steps));
    oldSteps[ind].step = parseFloat(event.target.value);
    const fakeEvent = {target:{name: name, value: oldSteps}}
    // @ts-ignore
    onChange(fakeEvent);
  }

  return (
    <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
      <label><span className={`${formStyles.LabelTitle}`}>{title}</span></label>
      <div className={styles.StepRow}>
        <span>Step</span><span>Color</span>
      </div>
      <div className={styles.StepContainer}>
        {steps.map((step:ColormapStep, ind)=>{
          const rgba = step.rgba;
          const previousStepValue = steps[ind-1] && steps[ind-1].step;
          const errorMsg = 
            colormapIsLogarithmic === true && ind === 0 && (step.step === 0 || step.step < 0 ) ? "Logarithmic step must be larger then 0" :
            ind > 0 && step.step < previousStepValue? "Each step must be greater or equal to previous step":
            colormapIsDiscrete && (step.step+'').match(/^[+-]?\d+(\.\d+)?$/) && (step.step+'').includes('.')? "Discrete steps must be whole numbers":
            undefined;

          return(
            <div key={ind} className={styles.StepRow}>
              <TextInput 
                title=""
                name={"Colormap_Steps" + ind}
                validated={errorMsg? false : true}
                errorMessage={errorMsg}
                type="number" 
                value={isNaN(step.step)? "" :step.step} 
                valueChanged={(event:React.ChangeEvent<HTMLInputElement>)=>{
                  handleStepChange(event, ind);
                }}
                required={true}
              />
              <div
                style={{position: "relative"}}
              >
                {/* 
                  following div should act as a button.
                  Button was turned into div, because it needs nested divs for the colorpicker.
                  These divs need to be nested because clicking on them need to keep this div in focus 
                  The div now namely uses a onblur to close the colorpicker (as replacement of the overlay with onclick previously used)
                */}
                <div 
                  // this tabIndex is needed to make sure the div (that should actually be a button, but was made div for above reasons) does receive onfocus and onblur event
                  tabIndex={0}
                  onBlur={(event)=> {
                    setVisiblepickerIndex(null);
                  }}
                  // Todo:
                  // I added the keypress so user can also tab enter open this colorpicker.
                  // anyway now the user might expect that excape closes it.
                  // Not only does this not work (see next line, does not distinct between keypresses), 
                  // also the event listener on <ModalBackground/> closes the entire modal on escape
                  // To avoid confusion I comment out for now
                  // https://github.com/nens/lizard-management-client/pull/747#discussion_r603177736
                  // onKeyPress={()=>setVisiblepickerIndex(ind)}
                  onClick={(event)=> {
                    if (
                      visiblepickerIndex === ind &&
                      event.currentTarget === event.target
                    ) {
                      setVisiblepickerIndex(null)
                    } 
                    else {setVisiblepickerIndex(ind)} 
                  }}
                  // type= button no longer valid since this is now a div
                  // type="button"
                  className={styles.ColormapStepToggleColorpicker}
                  style={{
                    backgroundColor: `rgba(${step.rgba.r},${step.rgba.g},${step.rgba.b},${step.rgba.a})`,
                    borderRadius: "4px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#ced4da",
                    boxShadow: "none",
                  }}
                >
                  { visiblepickerIndex === ind && (
                    <div style={{ position: 'absolute', zIndex: 9996, top: "40px" }}>
                      <div
                        style={{zIndex: 9999, position: "absolute"}}
                      >
                        <ChromePicker 
                          color={rgba} 
                          onChangeComplete={(color)=>{
                            handleColorChange(color.rgb,ind);
                          }}
                        />
                      </div>
                      
                    </div>
                  )}
                </div>
                
              </div>
              
              {/* Lateron add labels */}
              {/* <input value={step.label} onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                handleLabelChange(event, ind);
              }}/> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}