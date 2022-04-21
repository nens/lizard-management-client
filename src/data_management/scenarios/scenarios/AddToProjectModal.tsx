import { useState } from "react";
import { connect, useSelector } from "react-redux";
import { AppDispatch } from "../../..";
import { SelectDropdown, Value } from "../../../form/SelectDropdown";
import { SubmitButton } from "../../../form/SubmitButton";
import { getSelectedOrganisation } from "../../../reducers";
import { addNotification } from "../../../actions";
import { convertToSelectObject } from "../../../utils/convertToSelectObject";
import { useRecursiveFetch } from "../../../api/hooks";
import { Scenario } from "../../../types/scenarioType";
import { Project } from "../../../types/projectType";
import ModalBackground from "../../../components/ModalBackground";
import formStyles from "../../../styles/Forms.module.css";
import buttonStyles from "../../../styles/Buttons.module.css";

interface MyProps {
  scenarios: Scenario[];
  resetTable: Function | null;
  handleClose: () => void;
}

function AddToProjectModal(props: MyProps & DispatchProps) {
  const { scenarios } = props;
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [selectedProject, setSelectedProject] = useState<Value | null>(null);

  // useEffect to load the list of available monitoring networks for the selected organisation
  const {
    data: availableProjects,
    isFetching: projectsIsFetching,
  } = useRecursiveFetch("/api/v4/projects/", {
    organisation__uuid: selectedOrganisation.uuid,
  });

  // POST requests to update selected monitoring network with the selected timeseries
  const handleSubmit = async () => {
    if (!selectedProject) return;

    const fetchScenariosWithOptions = scenarios.map(scenario => {
      return fetch(`/api/v4/scenarios/${scenario.uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: selectedProject.value
        })
      });
    });

    try {
      const results = await Promise.all(fetchScenariosWithOptions);
      if (results.every(res => res.status === 200)) {
        props.addNotification("Success! Scenarios added to project", 2000);
        props.handleClose();
        props.resetTable && props.resetTable();
      } else {
        props.addNotification("An error occurred! Please try again!", 2000);
        console.error("Error adding scenarios to project: ", results);
      }
    } catch (message_1) {
      return console.error(message_1);
    };
  };

  return (
    <ModalBackground
      title={"Add to Project"}
      handleClose={props.handleClose}
      style={{
        width: "50%",
      }}
    >
      <div
        style={{
          padding: "20px 40px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p>
            Adding scenarios to a project will group them and they can be seen in the
            Lizard Catalogue.
          </p>
          <p>Which project would you like to add the selected scenarios to?</p>
          <SelectDropdown
            title={"Projects"}
            name={"project"}
            placeholder={"- Search and select -"}
            valueChanged={(value) => setSelectedProject(value as Value)}
            options={availableProjects ? availableProjects.map((project: Project) => convertToSelectObject(project.uuid, project.name)) : []}
            isLoading={projectsIsFetching}
            validated
          />
        </div>
        <div className={formStyles.ButtonContainer}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Cancel
          </button>
          <SubmitButton onClick={handleSubmit} readOnly={!selectedProject} />
        </div>
      </div>
    </ModalBackground>
  );
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(AddToProjectModal);
