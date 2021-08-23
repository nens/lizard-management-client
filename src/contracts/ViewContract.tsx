import React from "react";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import { ContractForm} from './ContractForm';
import {  useSelector } from "react-redux";
import {getContractForSelectedOrganisation, getUsage} from '../reducers';

export const ViewContract = () => {
  const contractFetched = useSelector(getContractForSelectedOrganisation);
  const usageFetched = useSelector(getUsage);

  return (
    <SpinnerIfNotLoaded
      loaded={!!contractFetched && !!usageFetched}
    >
      <ContractForm/>
    </SpinnerIfNotLoaded>
  );
};