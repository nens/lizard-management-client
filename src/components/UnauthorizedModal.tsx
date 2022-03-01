import ModalBackground from "./ModalBackground";
import styles from "./UnauthorizedModal.module.css";
import buttonStyles from "./../styles/Buttons.module.css";

interface Props {
  handleClose: () => void;
  redirectHome: () => void;
  handleOpenOrganisationSwitcher: () => void;
}

const UnauthorizedModal = (props: Props) => {
  const { redirectHome, handleOpenOrganisationSwitcher } = props;

  return (
    <ModalBackground
      title={"Not Authorized to view this page"}
      style={{
        height: 400,
      }}
    >
      <div className={styles.ModalBody}>
        <span>
          You are not authorized to view this page. <br /> Maybe you are authorized with a different
          organisation?
        </span>
      </div>
      <div className={styles.ModalFooter}>
        <button className={buttonStyles.NewButton} onClick={redirectHome}>
          Home
        </button>
        <button
          className={buttonStyles.NewButton}
          onClick={() => {
            handleOpenOrganisationSwitcher();
          }}
        >
          Switch organisation
        </button>
      </div>
    </ModalBackground>
  );
};

export default UnauthorizedModal;
