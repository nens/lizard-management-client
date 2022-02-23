import SpinnerIfNotLoaded from '../components/SpinnerIfNotLoaded';
import { getSelectedOrganisation} from '../reducers';
import { useSelector } from "react-redux";

const SpinnerIfStandardSelectorsNotLoaded: React.FC = ({ children }) => {
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  return (
    <SpinnerIfNotLoaded
      loaded={!!selectedOrganisation}
    >
      {children}
    </SpinnerIfNotLoaded>
  );
}

export default SpinnerIfStandardSelectorsNotLoaded;