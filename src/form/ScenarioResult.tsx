import React, { useEffect, useState } from 'react';
import MDSpinner from "react-md-spinner";
import {
  fetchScenarioRawResults,
  fetchScenarioBasicResults,
  fetchScenarioArrivalResults,
  fetchScenarioDamageResults,
  deleteScenarioResult
} from '../api/scenarios';
import formStyles from "../styles/Forms.module.css";

interface Result {
  id: number,
  name: string,
  scheduledForDeletion: boolean,
};
interface Results {
  results: Result[],
  isFetching: boolean,
  scheduledForBulkDeletion: boolean,
}

interface MyProps {
  name: string,
  uuid: string,
  formSubmitted?: boolean,
  readOnly?: boolean
};

export const ScenarioResult: React.FC<MyProps> = (props) => {
  const {
    name,
    uuid,
    formSubmitted,
    // readOnly
  } = props;

  const initialResults: Results = {
    isFetching: false,
    scheduledForBulkDeletion: false,
    results: []
  };
  const [rawResults, setRawResults] = useState<Results>(initialResults);
  const [basicResults, setBasicResults] = useState<Results>(initialResults);
  const [arrivalResults, setArrivalResults] = useState<Results>(initialResults);
  const [damageResults, setDamageResults] = useState<Results>(initialResults);

  useEffect(() => {
    setRawResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
    setBasicResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
    setArrivalResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
    setDamageResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
  
    fetchScenarioRawResults(uuid).then(res => 
      setRawResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: any) => {
          return {
            id: result.id,
            name: result.result_type.name,
            scheduledForDeletion: false
          };
        })
      })
    );

    fetchScenarioBasicResults(uuid).then(res => 
      setBasicResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: any) => {
          return {
            id: result.id,
            name: result.result_type.name,
            scheduledForDeletion: false
          };
        })
      })
    );

    fetchScenarioArrivalResults(uuid).then(res => 
      setArrivalResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: any) => {
          return {
            id: result.id,
            name: result.result_type.name,
            scheduledForDeletion: false
          };
        })
      })
    );

    fetchScenarioDamageResults(uuid).then(res => 
      setDamageResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: any) => {
          return {
            id: result.id,
            name: result.result_type.name,
            scheduledForDeletion: false
          };
        })
      })
    );
  }, [uuid]);

  useEffect(() => {
    if (formSubmitted === true) {
      rawResults.results.filter(
        result => result.scheduledForDeletion === true
      ).map(
        result => deleteScenarioResult(uuid, result.id)
      );
      basicResults.results.filter(
        result => result.scheduledForDeletion === true
      ).map(
        result => deleteScenarioResult(uuid, result.id)
      );
      arrivalResults.results.filter(
        result => result.scheduledForDeletion === true
      ).map(
        result => deleteScenarioResult(uuid, result.id)
      );
      damageResults.results.filter(
        result => result.scheduledForDeletion === true
      ).map(
        result => deleteScenarioResult(uuid, result.id)
      );
    };    
  }, [formSubmitted, uuid, rawResults, basicResults, arrivalResults, damageResults])

  const handleRawResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = rawResults.results.find(res => res.id === id);

    if (!result) {
      console.error('Could not find the selected result with id', id);
      return;
    };

    setRawResults({
      ...rawResults,
      results: rawResults.results.map(res => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion
          };
        };
        return res;
      })
    });
  };

  const handleBasicResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = basicResults.results.find(res => res.id === id);

    if (!result) {
      console.error('Could not find the selected result with id', id);
      return;
    };

    setBasicResults({
      ...basicResults,
      results: basicResults.results.map(res => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion
          };
        };
        return res;
      })
    });
  };

  const handleArrivalResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = arrivalResults.results.find(res => res.id === id);

    if (!result) {
      console.error('Could not find the selected result with id', id);
      return;
    };

    setArrivalResults({
      ...arrivalResults,
      results: arrivalResults.results.map(res => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion
          };
        };
        return res;
      })
    });
  };

  const handleDamageResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = damageResults.results.find(res => res.id === id);

    if (!result) {
      console.error('Could not find the selected result with id', id);
      return;
    };

    setDamageResults({
      ...damageResults,
      results: damageResults.results.map(res => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion
          };
        };
        return res;
      })
    });
  };

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      {rawResults.isFetching ? (
        <MDSpinner size={24} />
      ) : (
        rawResults.results.map(result => (
          <div key={result.id}>
            {result.name}
            <button onClick={(e) => handleRawResultDeletion(e, result.id)}>X</button>
          </div>
        ))
      )}{basicResults.isFetching ? (
        <MDSpinner size={24} />
      ) : (
        basicResults.results.map(result => (
          <div key={result.id}>
            {result.name}
            <button onClick={(e) => handleBasicResultDeletion(e, result.id)}>X</button>
          </div>
        ))
      )}{arrivalResults.isFetching ? (
        <MDSpinner size={24} />
      ) : (
        arrivalResults.results.map(result => (
          <div key={result.id}>
            {result.name}
            <button onClick={(e) => handleArrivalResultDeletion(e, result.id)}>X</button>
          </div>
        ))
      )}{damageResults.isFetching ? (
        <MDSpinner size={24} />
      ) : (
        damageResults.results.map(result => (
          <div key={result.id}>
            {result.name}
            <button onClick={(e) => handleDamageResultDeletion(e, result.id)}>X</button>
          </div>
        ))
      )}
    </label>
  )
}