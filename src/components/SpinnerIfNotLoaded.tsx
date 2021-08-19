import React from "react";
import MDSpinner from "react-md-spinner";
import spinnerStyles from '../styles/Spinner.module.css';

interface Props {
    loaded: boolean;
    children: any;
}

export const SpinnerIfNotLoaded = (props:  Props) => {

	const {
    loaded,
    children,
	} = props;

  
  if (loaded) {
    return children
  } else {
    return (
      <div
        className={spinnerStyles.SpinnerContainer}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
};
export default SpinnerIfNotLoaded;