import React from "react";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import { getSelectedOrganisation} from '../reducers';
import { useSelector } from "react-redux";

interface Props {
    children: any;
}

export const SpinnerIfStandardSelectorsNotLoaded = (props:  Props) => {

	const {
    children,
	} = props;

  
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  return (
    <SpinnerIfNotLoaded
      loaded={!!(
        selectedOrganisation
      )}
    >
      {children}
    </SpinnerIfNotLoaded>
  );

};
export default SpinnerIfStandardSelectorsNotLoaded;