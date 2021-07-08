import React, { useState, useEffect } from "react";
import MDSpinner from "react-md-spinner";
import spinnerStyles from '../styles/Spinner.module.css';
import {getAllSelectorsTruthy} from '../utils/AllSelectorsTruthy';

interface Props {
    selectorsToWaitFor: any[];
    FormComponent: any;
    retrieveCurrentFormDataFunction?: () => Promise<any>;
}

export const FormContainer = (props:  Props) => {

	const {
    selectorsToWaitFor,
    FormComponent,
    retrieveCurrentFormDataFunction,
	} = props;

  
  const [currentRecord, setCurrentRecord] = useState<Object | null>(null);
  const {allLoaded} = getAllSelectorsTruthy({selectorArray: selectorsToWaitFor})


  useEffect(() => {
    if (retrieveCurrentFormDataFunction) {
      (async () => {
        const record = await retrieveCurrentFormDataFunction();
        setCurrentRecord(record);
      })();
    }
  }, [retrieveCurrentFormDataFunction]);

  if (retrieveCurrentFormDataFunction && currentRecord && allLoaded) {
    return <FormComponent
      currentGroup={currentRecord}
    />;
  }
  else if (!retrieveCurrentFormDataFunction && allLoaded) {
    return <FormComponent
    />;
  }
  else {
    return (
      <div
        className={spinnerStyles.SpinnerContainer}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
};
export default FormContainer;