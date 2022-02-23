import MDSpinner from "react-md-spinner";
import spinnerStyles from '../styles/Spinner.module.css';

interface Props {
  loaded: boolean;
}

const SpinnerIfNotLoaded: React.FC<Props> = ({ loaded, children }) => {
  if (loaded) {
    return <>{children}</>
  } else {
    return (
      <div
        className={spinnerStyles.SpinnerContainer}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
};

export default SpinnerIfNotLoaded;