import React ,{ useEffect, useState } from "react";
import MDSpinner from "react-md-spinner";
import {PersonalApiKeyForm} from "./PersonalApiKeyForm";
import { DataRetrievalState} from '../types/retrievingDataTypes';


export const NewPersonalApiKey: React.FC = () => {
  const [allPersonalApiKeys, setAllPersonalApiKeys] = useState([]);
  const [allPersonalApiKeysFetching, setallPersonalApiKeysFetching] = useState<DataRetrievalState>("NEVER_DID_RETRIEVE");

  

  useEffect(() => {

    const fetchApiKeys = (url:string) => {
      setallPersonalApiKeysFetching("RETRIEVING");
      fetch(url)
      .then(response=>{
        if (response.status === 200) {
          return response.json();
        } else {
          // todo fix this erro notification
          // props.addNotification(status, 2000);
          setallPersonalApiKeysFetching({status:"ERROR", errorMesssage: response.status+'', url:url})
          return Promise.reject();
        }
      })
      .catch(()=>{
        console.error('error fetching apikeys', allPersonalApiKeysFetching);
      })
      .then(data=>{
        setAllPersonalApiKeys((allPersonalApiKeys)=>{return allPersonalApiKeys.concat((data && data.results) || [])});
        if (data && data.next === null) {
          setallPersonalApiKeysFetching("RETRIEVED");
        } else if (data && data.next !== null) {
          fetchApiKeys((data.next+'').split("lizard.net")[1])
        }
      })
    }
    if (allPersonalApiKeysFetching === "NEVER_DID_RETRIEVE") {
      fetchApiKeys('/api/v4/personalapikeys');
    }
  },[allPersonalApiKeysFetching])

  if (
    allPersonalApiKeysFetching === "RETRIEVED"
  ) {
    return ( 
      <PersonalApiKeyForm
        // @ts-ignore
        allPersonalApiKeys={allPersonalApiKeys}
      />
    );
  } else if (
    allPersonalApiKeysFetching === "NEVER_DID_RETRIEVE" ||
    allPersonalApiKeysFetching === "RETRIEVING"
    ) {
    return <div
      style={{
        position: "relative",
        top: 50,
        height: 300,
        bottom: 50,
        marginLeft: "50%"
      }}
    >
      <MDSpinner size={48} />
    </div>
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
      <span>Failed to load 'Personal api keys'. Please try refreshing</span>
    </div>
  }
}