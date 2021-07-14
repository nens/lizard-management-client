import React ,{ useEffect, useState } from "react";
import {PersonalApiKeyForm} from "./PersonalApiKeyForm";
import { DataRetrievalState} from '../types/retrievingDataTypes';
import { getRelativePathFromUrl } from "../utils/getRelativePathFromUrl";
import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';

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
          fetchApiKeys(getRelativePathFromUrl(data.next))
        }
      })
    }
    if (allPersonalApiKeysFetching === "NEVER_DID_RETRIEVE") {
      fetchApiKeys('/api/v4/personalapikeys');
    }
  },[allPersonalApiKeysFetching])

  return (
    <SpinnerIfNotLoaded
      loaded={
        allPersonalApiKeysFetching !== "NEVER_DID_RETRIEVE" &&
        allPersonalApiKeysFetching !== "RETRIEVING"
      }
    >
      {
      allPersonalApiKeysFetching !== "RETRIEVED" &&
      allPersonalApiKeysFetching !== "NEVER_DID_RETRIEVE" &&
      allPersonalApiKeysFetching !== "RETRIEVING" ?
        <div
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
      :
        <PersonalApiKeyForm
          // @ts-ignore
          allPersonalApiKeys={allPersonalApiKeys}
        />
      }
    </SpinnerIfNotLoaded>
  );
}