import React, { useState, useEffect } from "react";
// import { RouteComponentProps } from 'react-router';
// import { PersonalApiKeyForm } from "./PersonalApiKeyForm";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import { createFetchRecordFunctionFromUrl } from '../utils/createFetchRecordFunctionFromUrl';
import { ContractForm} from './ContractForm';
import {  useSelector } from "react-redux";
import {getContractForSelectedOrganisation, getUsage} from '../reducers';


// interface RouteParams {
//   uuid: string;
// };

// export const ViewContract: React.FC<RouteComponentProps<RouteParams>> = (props) => {
export const ViewContract = () => {
  const contractFetched = useSelector(getContractForSelectedOrganisation);
  const usageFetched = useSelector(getUsage);
  console.log('contractFetched', contractFetched)

  // const { uuid } = props.match.params;
  // useEffect(() => {
  //   (async () => {
  //     const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/personalapikeys/${uuid}`)();
  //     setCurrentRecord(currentRecord);
  //   })();
  // }, [uuid]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!contractFetched && !!usageFetched}
    >
      <ContractForm/>
    </SpinnerIfNotLoaded>
  );
};