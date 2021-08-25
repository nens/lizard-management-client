import React from "react";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import { ContractForm} from './ContractForm';
import {  useSelector } from "react-redux";
import {getContractForSelectedOrganisation, getUsage, getIsItSureSelectedOrganisationHasNoContract} from '../reducers';
import NoContractFoundComponent from '../components/NoContractFoundComponent';

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