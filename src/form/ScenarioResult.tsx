import React, { useEffect, useState } from "react";
import MDSpinner from "react-md-spinner";
import {
  fetchScenarioRawResults,
  fetchScenarioBasicResults,
  fetchScenarioArrivalResults,
  fetchScenarioDamageResults,
  deleteScenarioResult,
  deleteScenarioRawResults,
  deleteScenarioBasicResults,
  deleteScenarioArrivalResults,
  deleteScenarioDamageResults,
} from "../api/scenarios";
import { ScenarioResult as ScenarioResultFromApi } from "../types/scenarioType";
import formStyles from "../styles/Forms.module.css";
import buttonStyles from "../styles/Buttons.module.css";
import scenarioResultStyles from "./ScenarioResult.module.css";
import ResultFormModal from "../data_management/scenarios/scenarios/results/ResultFormModal";

type Result = ScenarioResultFromApi & {
  scheduledForDeletion: boolean;
}
interface Results {
  results: Result[];
  isFetching: boolean;
  scheduledForBulkDeletion: boolean;
}

interface MyProps {
  name: string;
  uuid: string;
  formSubmitted?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: () => void;
  readOnly?: boolean;
}

interface DeleteButtonProps {
  scheduledForDeletion: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: () => void;
}

interface ResultGroupTitleProps {
  name: string;
  results: Result[];
  scheduledForBulkDeletion: boolean;
  handleDeletion: (e: React.MouseEvent<HTMLButtonElement>) => void;
  openResultFormModal?: () => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: () => void;
}

interface ResultRowProps {
  uuid: string;
  scheduledForBulkDeletion: boolean;
  result: Result;
  handleDeletion: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
  openResultFormModal?: () => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: () => void;
}

// Render button for result deletion
const DeleteButton: React.FC<DeleteButtonProps> = ({
  scheduledForDeletion,
  handleClick,
  onFocus,
  onBlur,
}) => {
  return (
    <button
      id={"resultDeleteButton"}
      className={buttonStyles.IconButton}
      onClick={handleClick}
      style={{
        fontSize: 18,
        color: scheduledForDeletion ? "#2C3E50" : "#D50000",
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {scheduledForDeletion ? (
        <i className="fa fa-undo" title="Undo" />
      ) : (
        <i className="fa fa-trash" title="Delete" />
      )}
    </button>
  );
};

// Render result group title
const ResultGroupTitle: React.FC<ResultGroupTitleProps> = ({
  name,
  results,
  scheduledForBulkDeletion,
  handleDeletion,
  openResultFormModal,
  onFocus,
  onBlur,
}) => {
  return (
    <div className={scenarioResultStyles.ResultTitleRow}>
      <div className={scenarioResultStyles.ResultTitleRowLeft}>
        <span>{name}</span>
        {openResultFormModal ? (
          <button
            id={"resultAddButton"}
            title={`Add a new ${name} result`}
            className={buttonStyles.IconButton}
            onClick={(e) => {
              e.preventDefault();
              openResultFormModal();
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <i className="fa fa-plus-circle" />
          </button>
        ): null}
      </div>
      {results.length ? (
        <DeleteButton
          scheduledForDeletion={scheduledForBulkDeletion}
          handleClick={handleDeletion}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ) : null}
    </div>
  );
};

// Render result row
const ResultRow: React.FC<ResultRowProps> = ({
  scheduledForBulkDeletion,
  result,
  handleDeletion,
  openResultFormModal,
  onFocus,
  onBlur,
}) => {
  return (
    <div
      className={scenarioResultStyles.ResultRow}
      style={{
        color: scheduledForBulkDeletion || result.scheduledForDeletion ? "lightgrey" : "",
      }}
    >
      {result.family !== "Raw" && !scheduledForBulkDeletion && !result.scheduledForDeletion ? (
        <button
          className={`${buttonStyles.Link} ${scenarioResultStyles.ResultName}`}
          title={"Click to open"}
          onClick={openResultFormModal}
        >
          {result.name}
        </button>
      ) : (
        <span className={scenarioResultStyles.ResultName}>{result.name}</span>
      )}
      {!scheduledForBulkDeletion ? (
        <DeleteButton
          scheduledForDeletion={result.scheduledForDeletion}
          handleClick={(e) => handleDeletion(e, result.id)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ) : null}
    </div>
  );
};

export const ScenarioResult: React.FC<MyProps> = (props) => {
  const {
    uuid,
    formSubmitted,
    onFocus,
    onBlur,
  } = props;

  const initialResults: Results = {
    isFetching: false,
    scheduledForBulkDeletion: false,
    results: [],
  };
  const [rawResults, setRawResults] = useState<Results>(initialResults);
  const [basicResults, setBasicResults] = useState<Results>(initialResults);
  const [arrivalResults, setArrivalResults] = useState<Results>(initialResults);
  const [damageResults, setDamageResults] = useState<Results>(initialResults);

  // set result type to open / close the ResultFormModal
  const [resultType, setResultType] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const closeResultFormModal = () => {
    setResult(null);
    setResultType(null);
  };

  const fetchRawResults = (uuid: string) => {
    setRawResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
    fetchScenarioRawResults(uuid).then((res) =>
      setRawResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: ScenarioResultFromApi) => {
          return {
            ...result,
            scheduledForDeletion: false
          };
        }),
      })
    );
  };

  const fetchBasicResults = (uuid: string) => {
    setBasicResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
    fetchScenarioBasicResults(uuid).then((res) =>
      setBasicResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: ScenarioResultFromApi) => {
          return {
            ...result,
            scheduledForDeletion: false
          };
        }),
      })
    );
  };

  const fetchArrivalResults = (uuid: string) => {
    setArrivalResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
    fetchScenarioArrivalResults(uuid).then((res) =>
      setArrivalResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: ScenarioResultFromApi) => {
          return {
            ...result,
            scheduledForDeletion: false
          };
        }),
      })
    );
  };

  const fetchDamageResults = (uuid: string) => {
    setDamageResults({
      isFetching: true,
      scheduledForBulkDeletion: false,
      results: [],
    });
    fetchScenarioDamageResults(uuid).then((res) =>
      setDamageResults({
        isFetching: false,
        scheduledForBulkDeletion: false,
        results: res.results.map((result: ScenarioResultFromApi) => {
          return {
            ...result,
            scheduledForDeletion: false
          };
        }),
      })
    );
  };

  // useEffect to fetch different results of scenario
  useEffect(() => {
    fetchRawResults(uuid);
    fetchBasicResults(uuid);
    fetchArrivalResults(uuid);
    fetchDamageResults(uuid);
  }, [uuid]);

  // useEffect for deletion of selected results when form is submitted
  useEffect(() => {
    if (formSubmitted) {
      // Delete results in bulks
      if (rawResults.scheduledForBulkDeletion) deleteScenarioRawResults(uuid);
      if (basicResults.scheduledForBulkDeletion) deleteScenarioBasicResults(uuid);
      if (arrivalResults.scheduledForBulkDeletion) deleteScenarioArrivalResults(uuid);
      if (damageResults.scheduledForBulkDeletion) deleteScenarioDamageResults(uuid);

      // Delete selected raw results separately if bulk deletion is not selected
      if (!rawResults.scheduledForBulkDeletion) {
        rawResults.results
          .filter((result) => result.scheduledForDeletion === true)
          .map((result) => deleteScenarioResult(uuid, result.id));
      }

      // Delete selected basic results separately if bulk deletion is not selected
      if (!basicResults.scheduledForBulkDeletion) {
        basicResults.results
          .filter((result) => result.scheduledForDeletion === true)
          .map((result) => deleteScenarioResult(uuid, result.id));
      }

      // Delete selected arrival results separately if bulk deletion is not selected
      if (!arrivalResults.scheduledForBulkDeletion) {
        arrivalResults.results
          .filter((result) => result.scheduledForDeletion === true)
          .map((result) => deleteScenarioResult(uuid, result.id));
      }

      // Delete selected damage results separately if bulk deletion is not selected
      if (!damageResults.scheduledForBulkDeletion) {
        damageResults.results
          .filter((result) => result.scheduledForDeletion === true)
          .map((result) => deleteScenarioResult(uuid, result.id));
      }
    }
  }, [formSubmitted, uuid, rawResults, basicResults, arrivalResults, damageResults]);

  const handleRawResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = rawResults.results.find((res) => res.id === id);

    if (!result) {
      console.error("Could not find the selected result with id", id);
      return;
    }

    setRawResults({
      ...rawResults,
      results: rawResults.results.map((res) => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion,
          };
        }
        return res;
      }),
    });
  };

  const handleBasicResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = basicResults.results.find((res) => res.id === id);

    if (!result) {
      console.error("Could not find the selected result with id", id);
      return;
    }

    setBasicResults({
      ...basicResults,
      results: basicResults.results.map((res) => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion,
          };
        }
        return res;
      }),
    });
  };

  const handleArrivalResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = arrivalResults.results.find((res) => res.id === id);

    if (!result) {
      console.error("Could not find the selected result with id", id);
      return;
    }

    setArrivalResults({
      ...arrivalResults,
      results: arrivalResults.results.map((res) => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion,
          };
        }
        return res;
      }),
    });
  };

  const handleDamageResultDeletion = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    const result = damageResults.results.find((res) => res.id === id);

    if (!result) {
      console.error("Could not find the selected result with id", id);
      return;
    }

    setDamageResults({
      ...damageResults,
      results: damageResults.results.map((res) => {
        if (res.id === result.id) {
          return {
            ...result,
            scheduledForDeletion: !result.scheduledForDeletion,
          };
        }
        return res;
      }),
    });
  };

  const handleRawResultsBulkDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRawResults({
      ...rawResults,
      scheduledForBulkDeletion: !rawResults.scheduledForBulkDeletion,
    });
  };
  const handleBasicResultsBulkDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setBasicResults({
      ...basicResults,
      scheduledForBulkDeletion: !basicResults.scheduledForBulkDeletion,
    });
  };
  const handleArrivalResultsBulkDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setArrivalResults({
      ...arrivalResults,
      scheduledForBulkDeletion: !arrivalResults.scheduledForBulkDeletion,
    });
  };
  const handleDamageResultsBulkDeletion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDamageResults({
      ...damageResults,
      scheduledForBulkDeletion: !damageResults.scheduledForBulkDeletion,
    });
  };

  return (
    <div className={`${formStyles.Label} ${scenarioResultStyles.ResultsGrid}`}>
      <div>
        <ResultGroupTitle
          name={"Raw"}
          results={rawResults.results}
          scheduledForBulkDeletion={rawResults.scheduledForBulkDeletion}
          handleDeletion={handleRawResultsBulkDeletion}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {rawResults.isFetching ? (
          <MDSpinner size={24} />
        ) : (
          rawResults.results.map((result) => (
            <ResultRow
              key={result.id}
              uuid={uuid}
              scheduledForBulkDeletion={rawResults.scheduledForBulkDeletion}
              result={result}
              handleDeletion={handleRawResultDeletion}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          ))
        )}
      </div>
      <div>
        <ResultGroupTitle
          name={"Arrival"}
          results={arrivalResults.results}
          scheduledForBulkDeletion={arrivalResults.scheduledForBulkDeletion}
          handleDeletion={handleArrivalResultsBulkDeletion}
          openResultFormModal={() => setResultType("Arrival")}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {arrivalResults.isFetching ? (
          <MDSpinner size={24} />
        ) : (
          arrivalResults.results.map((result) => (
            <ResultRow
              key={result.id}
              uuid={uuid}
              scheduledForBulkDeletion={arrivalResults.scheduledForBulkDeletion}
              result={result}
              handleDeletion={handleArrivalResultDeletion}
              openResultFormModal={() => setResult(result)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          ))
        )}
      </div>
      <div>
        <ResultGroupTitle
          name={"Basic"}
          results={basicResults.results}
          scheduledForBulkDeletion={basicResults.scheduledForBulkDeletion}
          handleDeletion={handleBasicResultsBulkDeletion}
          openResultFormModal={() => setResultType("Basic")}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {basicResults.isFetching ? (
          <MDSpinner size={24} />
        ) : (
          basicResults.results.map((result) => (
            <ResultRow
              key={result.id}
              uuid={uuid}
              scheduledForBulkDeletion={basicResults.scheduledForBulkDeletion}
              result={result}
              handleDeletion={handleBasicResultDeletion}
              openResultFormModal={() => setResult(result)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          ))
        )}
      </div>
      <div>
        <ResultGroupTitle
          name={"Damage"}
          results={damageResults.results}
          scheduledForBulkDeletion={damageResults.scheduledForBulkDeletion}
          handleDeletion={handleDamageResultsBulkDeletion}
          openResultFormModal={() => setResultType("Damage")}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {damageResults.isFetching ? (
          <MDSpinner size={24} />
        ) : (
          damageResults.results.map((result) => (
            <ResultRow
              key={result.id}
              uuid={uuid}
              scheduledForBulkDeletion={damageResults.scheduledForBulkDeletion}
              result={result}
              handleDeletion={handleDamageResultDeletion}
              openResultFormModal={() => setResult(result)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          ))
        )}
      </div>
      {resultType || result ? (
        <ResultFormModal
          resultType={resultType}
          result={result}
          handleClose={closeResultFormModal}
          refetchResults={() => {
            if (resultType === "Basic") fetchBasicResults(uuid);
            else if (resultType === "Arrival") fetchArrivalResults(uuid);
            else if (resultType === "Damage") fetchDamageResults(uuid);
            else {
              fetchBasicResults(uuid);
              fetchArrivalResults(uuid);
              fetchDamageResults(uuid);
            };
          }}
        />
      ) : null}
    </div>
  );
};
