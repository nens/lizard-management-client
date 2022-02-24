import { useHistory } from 'react-router';
// We will need styles later to factor out the over stule of the svg passed to clickableComponent
// import styles from './TableActionButtons.module.css';
import ActionButton from './ActionButton';


export interface Action<TableRowType> {
  displayValue: string;
  actionFunction: (
    row: TableRowType,
    triggerReloadWithCurrentPage: () => void,
    triggerReloadWithBasePage: () => void
  ) => void;
}

interface Props<TableRowType> {
  actions: Action<TableRowType>[];
  tableRow: TableRowType;
  triggerReloadWithCurrentPage: () => void; 
  triggerReloadWithBasePage: () => void;
  editUrl?: string; // optional parameter for EDIT action
}

function TableActionButtons<TableRowType> (props: Props<TableRowType>) {
  const {
    actions,
    tableRow,
    triggerReloadWithCurrentPage,
    triggerReloadWithBasePage,
    editUrl
  } = props;

  const history = useHistory();

  const actionList = editUrl ? [
    // Edit action to open the object in the form
    // and is optional based on parameter "editUrl"
    {
      displayValue: 'Edit',
      actionFunction: () => history.push(editUrl)
    },
    ...actions
  ] : actions;

  return (
    <ActionButton
      actions={actionList.map(action => action.displayValue)}
      onChange={actionDisplayValue=>{
        const currentAction = actionList.find(action => action.displayValue === actionDisplayValue);
        if (currentAction) currentAction.actionFunction(tableRow, triggerReloadWithCurrentPage, triggerReloadWithBasePage);
      }}
      display={<svg xmlns="http://www.w3.org/2000/svg" width="6" height="24" viewBox="0 0 4 16"><defs><style></style></defs><g transform="translate(-192)"><g transform="translate(192)"><circle cx="2" cy="2" r="2" transform="translate(0 6)"/><circle cx="2" cy="2" r="2" transform="translate(0 12)"/><circle cx="2" cy="2" r="2"/></g></g></svg>}
    />
  );
};

export default TableActionButtons;