import React from "react";
import { useState } from "react";
import { IntegerInput } from "./../../form/IntegerInput";
import { SubmitButton } from "../../form/SubmitButton";
import { CustomRadioSelect } from "../../form/CustomRadioSelect";
import {
  ColormapAllSteps,
  ColormapStepApi,
  toApiColorMapStep,
  colorMapStepApiToColormapStep,
} from "../../form/ColormapAllSteps";
import { useForm, Values } from "../../form/useForm";
import styles from "./ColormapForm.module.css";

import formStyles from "./../../styles/Forms.module.css";
import buttonStyles from "../../styles/Buttons.module.css";

export interface ColomapObj {
  type: string;
  data: ColormapStepApi[];
  // name: string,
  // description: string,
  labels: any[];
  log?: boolean;
  rescalable?: boolean;
  free?: boolean;
  invalid?: ColormapStepApi;
}

interface Props {
  currentRecord: ColomapObj;
  cancelAction: () => void;
  confirmAction: (record: ColomapObj) => void;
}

const ColormapForm: React.FC<Props> = (props) => {
  const { currentRecord, cancelAction, confirmAction } = props;

  const [stepLengthFieldIsEmpty, setStepLengthFieldIsEmpty] = useState<boolean>(false);

  const initialValues = currentRecord
    ? {
        // name: currentRecord.name || '',
        // description: currentRecord.description || '',
        data: (currentRecord.data || []).map(colorMapStepApiToColormapStep),
        type: currentRecord.log ? "Logarithmic" : currentRecord.type || "GradientColormap",
        rescalable: currentRecord.rescalable,
        labels: currentRecord.labels,
        invalid: currentRecord.invalid,
        free: currentRecord.free,
      }
    : {
        name: null,
        description: null,
        data: [
          {
            step: 0,
            rgba: { r: 255, g: 255, b: 255, a: 1 },
            label: "",
          },
          {
            step: 1,
            rgba: { r: 0, g: 255, b: 100, a: 1 },
            label: "",
          },
        ],
        type: "GradientColormap",
        rescalable: true,
      };

  // example data of discrete custom colormap with labels.
  /*
  {"data": [[0, [255, 255, 255, 255]], [1, [0, 255, 100, 255]], [2, [255, 0, 186, 255]], [3, [0, 27, 255, 255]]], "type": "DiscreteColormap", "labels": {"nl_NL": [[0, "BAG - woonfunctie"], [1, "BAG - celfunctie"], [2, "BAG - industriefunctie"], [3, "BAG - industriefunctie"]]}, "invalid": [7, 255, 255, 255]}
  //*/

  const onSubmit = (values: Values) => {
    let jsonObj: ColomapObj = {
      data: [],
      type: values.type,
      // name: values.name,
      // description: values.description,
      labels: values.labels,
    };
    if (values.free === true || values.free === false) {
      jsonObj.free = values.free;
    }
    if (values.invalid) {
      jsonObj.invalid = values.invalid;
    }
    if (values.type === "Logarithmic") {
      jsonObj.type = "GradientColormap";
      // the api seems to only accept a "log" field if log:true
      jsonObj.log = true;
    }
    jsonObj.data = values.data.map(toApiColorMapStep);

    confirmAction(jsonObj);
  };

  const {
    values,
    tryToSubmitForm,
    handleInputChange,
    handleValueChanges,
    handleSubmit,
    handleReset,
  } = useForm({ initialValues, onSubmit });

  return (
    <form
      className={`${formStyles.Form} ${styles.Form}`}
      onSubmit={handleSubmit}
      onReset={handleReset}
      style={{
        // reset form styles that are not applicable in modal
        // margin: 0,
        // padding: 0,
        margin: 0,
        padding: 0,
        // height: "unset", // why wasthis previously needed?
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/*  below 2 blocks are commented out. We will need them again once we can add name and description to the colormap form  */}
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
          valueChanged={(event) => {
            if (event.target.value === "DiscreteColormap") {
              handleInputChange(event);
            } else {
              handleValueChanges([
                { name: "invalid", value: undefined },
                { name: "labels", value: undefined },
                { name: "type", value: event.target.value },
              ]);
            }
          }}
          readonly={false}
          options={[
            {
              value: "DiscreteColormap",
              component: (
                <div className={styles.TypeLabel}>
                  <div style={{ display: "flex" }}>
                    <div style={{ backgroundColor: "#43E669", width: "33%" }}></div>
                    <div style={{ backgroundColor: "#F95959", width: "33%" }}></div>
                    <div style={{ backgroundColor: "#8A6EFF", width: "33%" }}></div>
                  </div>
                  <div>Discrete</div>
                </div>
              ),
              selectedComponent: (
                <div className={`${styles.TypeLabel} ${styles.TypeLabelSelected}`}>
                  <div style={{ display: "flex" }}>
                    <div style={{ backgroundColor: "#43E669", width: "33%" }}></div>
                    <div style={{ backgroundColor: "#F95959", width: "33%" }}></div>
                    <div style={{ backgroundColor: "#8A6EFF", width: "33%" }}></div>
                  </div>
                  <div>Discrete</div>
                </div>
              ),
            },
            {
              value: "GradientColormap",
              component: (
                <div className={styles.TypeLabel}>
                  <div
                    style={{
                      background:
                        "transparent linear-gradient(90deg, #6E5757 0%, #C8E2EC 0%, #4247EC 100%) 0% 0% no-repeat padding-box",
                    }}
                  ></div>
                  <div>Gradient</div>
                </div>
              ),
              selectedComponent: (
                <div className={`${styles.TypeLabel} ${styles.TypeLabelSelected}`}>
                  <div
                    style={{
                      background:
                        "transparent linear-gradient(90deg, #6E5757 0%, #C8E2EC 0%, #4247EC 100%) 0% 0% no-repeat padding-box",
                    }}
                  ></div>
                  <div>Gradient</div>
                </div>
              ),
            },
            {
              value: "Logarithmic",
              component: (
                <div className={styles.TypeLabel}>
                  <div
                    style={{
                      background:
                        "transparent linear-gradient(90deg, #6E5757 0%, #FFF67A 0%, #FFD153 56%, #FF2E2E 89%, #6D1600 100%) 0% 0% no-repeat padding-box",
                    }}
                  ></div>
                  <div>Logarithmic</div>
                </div>
              ),
              selectedComponent: (
                <div className={`${styles.TypeLabel} ${styles.TypeLabelSelected}`}>
                  <div
                    style={{
                      background:
                        "transparent linear-gradient(90deg, #6E5757 0%, #FFF67A 0%, #FFD153 56%, #FF2E2E 89%, #6D1600 100%) 0% 0% no-repeat padding-box",
                    }}
                  ></div>
                  <div>Logarithmic</div>
                </div>
              ),
            },
          ]}
        ></CustomRadioSelect>
        <IntegerInput
          title="Colormap Steps"
          name={"data"}
          validated={true}
          valueChanged={(e) => {
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
                step: values.data[oldLength - 1].step,
                rgba: values.data[oldLength - 1].rgba,
                label: "",
              });
              const newArray = values.data.concat(tempArray);
              const newEvent = {
                ...e,
                target: { ...e.target, value: newArray, name: e.target.name },
              };
              handleInputChange(newEvent);
            } /*if (difference < 0)*/ else {
              const newArray = values.data.filter((_item: ColormapStepApi, i: number) => {
                if (i + 1 > values.data.length + difference) {
                  // difference is negative so we add it
                  return false;
                } else {
                  return true;
                }
              });
              const newEvent = {
                ...e,
                target: { ...e.target, value: newArray, name: e.target.name },
              };
              handleInputChange(newEvent);
            }
          }}
          value={stepLengthFieldIsEmpty ? "" : (values.data && values.data.length) || 0}
        />
        <div style={{ flexGrow: 1, minHeight: 0 }}>
          <ColormapAllSteps
            title={"Colormap Values"}
            steps={values.data}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleInputChange(event);
            }}
            name={"data"}
            colormapIsLogarithmic={values.type === "Logarithmic"}
            colormapIsDiscrete={values.type === "DiscreteColormap"}
          ></ColormapAllSteps>
        </div>
        {/* </div> */}
      </div>

      <div className={formStyles.ButtonContainer}>
        <button className={buttonStyles.ButtonLink} onClick={cancelAction} type="button">
          CANCEL
        </button>
        <SubmitButton
          onClick={() => {
            tryToSubmitForm();
          }}
        />
      </div>
    </form>
  );
};

export { ColormapForm };
