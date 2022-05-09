import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import ScenarioForm from "./ScenarioForm";
import SpinnerIfNotLoaded from "../../../components/SpinnerIfNotLoaded";
import { createFetchRecordFunctionFromUrl } from "../../../utils/createFetchRecordFunctionFromUrl";
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import { Scenario } from "../../../types/scenarioType";
import { Project } from "../../../types/projectType";

interface RouteProps {
  uuid: string;
}

export const EditScenario = (props: RouteComponentProps<RouteProps>) => {
  const [currentRecord, setCurrentRecord] = useState<Scenario | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const currentRecord: Scenario = await createFetchRecordFunctionFromUrl(`/api/v4/scenarios/${uuid}/`)();
      const selectedProject = currentRecord.project ? await fetch(`/api/v4/projects/${getUuidFromUrl(currentRecord.project)}/`).then(res => res.json()) : null;

      setCurrentRecord(currentRecord);
      setSelectedProject(selectedProject);
    })();
  }, [uuid]);

  return (
    <SpinnerIfNotLoaded
      loaded={
        !!currentRecord &&
        (!currentRecord.project || !!selectedProject)
      }
    >
      <ScenarioForm currentRecord={currentRecord!} selectedProject={selectedProject} />;
    </SpinnerIfNotLoaded>
  );
};
