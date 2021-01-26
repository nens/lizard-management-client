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
      console.log("response", response)
      if (response.status === 200) {
        console.log("response2", response)
        return response.json();
      } else {
        console.log("response3", response)
          // todo fix this erro notification
          // props.addNotification(status, 2000);
          console.error(response);
          setallPersonalApiKeysFetching({status:"ERROR", errorMesssage: response.status+'', url:"/api/v4/personalapikeys"})
      }
    })
    .then(data=>{
      console.log("data4", data)
      setAllPersonalApiKeys((data && data.results) || []);
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