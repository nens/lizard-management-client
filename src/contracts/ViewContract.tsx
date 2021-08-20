import React, { useState, useEffect } from "react";
// import { RouteComponentProps } from 'react-router';
// import { PersonalApiKeyForm } from "./PersonalApiKeyForm";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import { createFetchRecordFunctionFromUrl } from '../utils/createFetchRecordFunctionFromUrl';
import { ContractForm} from './ContractForm';

// interface RouteParams {
//   uuid: string;
// };

// export const ViewContract: React.FC<RouteComponentProps<RouteParams>> = (props) => {
export const ViewContract = () => {
  const [currentRecord, setCurrentRecord] = useState<any | null>(null);

  // const { uuid } = props.match.params;
  // useEffect(() => {
  //   (async () => {
  //     const currentRecord = await createFetchRecordFunctionFromUrl(`/api/v4/personalapikeys/${uuid}`)();
  //     setCurrentRecord(currentRecord);
  //   })();
  // }, [uuid]);

  return (
    <SpinnerIfNotLoaded
      loaded={!!currentRecord}
    >
      {/* <PersonalApiKeyForm
        currentRecord={currentRecord}
      /> */}
    </SpinnerIfNotLoaded>
  );
};