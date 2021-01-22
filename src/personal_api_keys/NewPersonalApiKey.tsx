import React ,{ useEffect, useState } from "react";
import MDSpinner from "react-md-spinner";
import {PersonalApiKeyForm} from "./PersonalApiKeyForm";
import { DataRetrievalState} from '../types/retrievingDataTypes';


export const NewPersonalApiKey: React.FC = () => {
  const [allPersonalApiKeys, setAllPersonalApiKeys] = useState([]);
  const [allPersonalApiKeysFetching, setallPersonalApiKeysFetching] = useState<DataRetrievalState>("NEVER_DID_RETRIEVE");

  useEffect(() => {
    setallPersonalApiKeysFetching("RETRIEVING");
    fetch('/api/v4/personalapikeys')
    .then(response=>{
      if (response.status === 200) {
        return response.json();
      } else {
          // todo fix this erro notification
          // props.addNotification(status, 2000);
          console.error(response);
          setallPersonalApiKeysFetching({status:"ERROR", errorMesssage: response.status+'', url:"/api/v4/personalapikeys"})
      }
    })
    .then(data=>{
      setAllPersonalApiKeys(data.results);
      setallPersonalApiKeysFetching("RETRIEVED");
    })
  },[])

  if (
    allPersonalApiKeysFetching === "RETRIEVED"
  ) {
    return ( 
      <PersonalApiKeyForm
        // @ts-ignore
        allPersonalApiKeys={allPersonalApiKeys}
      />
    );
  } else {
    return <div
      style={{
        position: "relative",
        top: 50,
        height: 300,
        bottom: 50,
        marginLeft: "50%"
      }}
    >
      <MDSpinner size={24} />
    </div>
  }
}