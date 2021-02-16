// Functions that call the scenario API
export const fetchScenariosResults = async (scenarioId: string) => {
  const response = await fetch(`/api/v4/scenarios/${scenarioId}/results/`, {
    credentials: "same-origin",
    method: "GET",
    headers: {"Content-Type": "application/json"}
  });

  return response.json();
};

export const fetchScenarioRawResults = async (scenarioId: string) => {
  const response = await fetch(`/api/v4/scenarios/${scenarioId}/results/raw/`, {
    credentials: "same-origin",
    method: "GET",
    headers: {"Content-Type": "application/json"}
  });

  return response.json();
};

export const fetchScenarioBasicResults = async (scenarioId: string) => {
  const response = await fetch(`/api/v4/scenarios/${scenarioId}/results/basic/`, {
    credentials: "same-origin",
    method: "GET",
    headers: {"Content-Type": "application/json"}
  });

  return response.json();
};

export const fetchScenarioArrivalResults = async (scenarioId: string) => {
  const response = await fetch(`/api/v4/scenarios/${scenarioId}/results/arrival/`, {
    credentials: "same-origin",
    method: "GET",
    headers: {"Content-Type": "application/json"}
  });

  return response.json();
};

export const fetchScenarioDamageResults = async (scenarioId: string) => {
  const response = await fetch(`/api/v4/scenarios/${scenarioId}/results/damage/`, {
    credentials: "same-origin",
    method: "GET",
    headers: {"Content-Type": "application/json"}
  });

  return response.json();
};

export const deleteScenarioResult = (scenarioId: string, resultId: number) => {
  fetch(`/api/v4/scenarios/${scenarioId}/results/${resultId}/`, {
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
};

export const deleteScenarioRawResults = (scenarioId: string) => {
  fetch(`/api/v4/scenarios/${scenarioId}/results/raw/`, {
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
};

export const deleteScenarioBasicResults = (scenarioId: string) => {
  fetch(`/api/v4/scenarios/${scenarioId}/results/basic/`, {
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
};

export const deleteScenarioArrivalResults = (scenarioId: string) => {
  fetch(`/api/v4/scenarios/${scenarioId}/results/arrival/`, {
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
};

export const deleteScenarioDamageResults = (scenarioId: string) => {
  fetch(`/api/v4/scenarios/${scenarioId}/results/damage/`, {
    credentials: "same-origin",
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
};