import React from "react";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import { getSelectedOrganisation} from '../reducers';
import { useSelector } from "react-redux";

interface Props {
    loaded: boolean;
    children: any;
}

export const SpinnerIfStandardSelectorsNotLoaded = (props:  Props) => {

	const {
    loaded,
    children,
	} = props;

  
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  return (
    <SpinnerIfNotLoaded
      loaded={!!(
        selectedOrganisation && loaded
      )}
    >
      {children}
    </SpinnerIfNotLoaded>
  );

};
export default SpinnerIfStandardSelectorsNotLoaded;