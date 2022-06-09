import ModalBackground from "../../../../components/ModalBackground";
import ResultForm from "./ResultForm";

interface MyProps {
  resultType: string;
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
      <div style={{ paddingLeft: 30, paddingRight: 30 }}>
        <ResultForm formInModal resultType={props.resultType} closeModal={props.handleClose} />
      </div>
    </ModalBackground>
  );
}

export default ResultFormModal;
