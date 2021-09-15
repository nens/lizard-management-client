import React from "react";
import { useSelector } from "react-redux";
import { ContractForm} from './ContractForm';
import {
  getContractForSelectedOrganisation,
  getUsage,
  getIsItSureSelectedOrganisationHasNoContract
} from '../reducers';
import NoContractFoundComponent from './NoContractFoundComponent';
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';

export const ViewContract = () => {
  const contractFetched = useSelector(getContractForSelectedOrganisation);
  const usageFetched = useSelector(getUsage);
  const sureContractDoesnotExist = useSelector(getIsItSureSelectedOrganisationHasNoContract)

  return (
    <SpinnerIfNotLoaded
      loaded={sureContractDoesnotExist || (!!contractFetched && !!usageFetched)}
    >
      {sureContractDoesnotExist? 
      <NoContractFoundComponent/>
      : 
      <ContractForm/>
      }
    </SpinnerIfNotLoaded>
  );
};