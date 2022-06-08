import ModalBackground from "../../../../components/ModalBackground";
import ResultForm from "./ResultForm";

interface MyProps {
  handleClose: () => void;
}

function ResultFormModal(props: MyProps) {
  return (
    <ModalBackground
      title={"New Scenario Result"}
      handleClose={props.handleClose}
      style={{
        width: "80%",
        height: "80%",
      }}
    >
      <ResultForm />
    </ModalBackground>
  );
}

export default ResultFormModal;
