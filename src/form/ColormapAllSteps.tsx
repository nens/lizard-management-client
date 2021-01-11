import React, { useState } from "react";
import styles from "./ColormapAllSteps.module.css";
import formStyles from "../styles/Forms.module.css";
import { ChromePicker, RGBColor } from 'react-color';


export interface ColormapStep {
  step: number,
  rgba: RGBColor,
  label: string,
}

interface Props {
  name: string,
  title: string | JSX.Element,
  steps: ColormapStep[],
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

export const ColormapAllSteps: React.FC<Props> = (props) => {

  const {
    title,
    steps,
    name,
    onChange,
  } = props;

  const [visiblepickerIndex, setVisiblepickerIndex] = useState<null | number>(null);


  // const [color, setColor] = useState();
  // const handleChange = color => setColor(color);
  // return (
  //   <div className="App">
  //     <SketchPicker color={color} onChangeComplete={handleChange} />
  //   </div>

  const handleColorChange=(color: RGBColor, ind: number) => {
    const oldSteps = JSON.parse(JSON.stringify(steps));
    oldSteps[ind].rgba = color;
    // const (event: as React.ChangeEvent<HTMLInputElement>) = {target:{name: name, value: oldSteps}}
    const event = {target:{name: name, value: oldSteps}}
    // @ts-ignore
    onChange(event);
  }

  return (
    <div>
      <label>{title}</label>
      {steps.map((step:ColormapStep, ind)=>{
        const rgba = step.rgba;
        return(
          <div key={ind}>
            <span>{step.step}</span>
            <button 
              onClick={()=> {if (visiblepickerIndex === ind) {setVisiblepickerIndex(null)} else {setVisiblepickerIndex(ind)} }}
              type="button"
              className={styles.ColormapStepToggleColorpicker}
              style={{
                backgroundColor: `rgba(${step.rgba.r},${step.rgba.g},${step.rgba.b},${step.rgba.a})`,
              }}
            >
              
            </button>

            { visiblepickerIndex === ind && (
              <div style={{ position: 'absolute' }}>
               <ChromePicker color={rgba} onChangeComplete={(color)=>{
                  handleColorChange(color.rgb,ind);
                  setVisiblepickerIndex(null);
                }}
                />
              </div>
            ) }
            
            <input value={step.label}/>
          </div>
        );
      })}
    </div>
  );
}