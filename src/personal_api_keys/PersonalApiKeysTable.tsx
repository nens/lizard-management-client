import React, { useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from "../components/TableStateContainer";
import { ExplainSideColumn } from "../components/ExplainSideColumn";
import tableStyles from "../components/Table.module.css";
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";
import TableActionButtons from "../components/TableActionButtons";
import { personalApiKeysFormHelpText } from "../utils/help_texts/helpTextForPersonalAPIKeys";
import DeleteModal from "../components/DeleteModal";
import { fetchWithOptions } from "../utils/fetchWithOptions";
import { ColumnDefinition } from "../components/Table";
import { PersonalApiKey } from "../types/personalApiKeyType";

export const baseUrl = "/api/v4/personalapikeys/";
const navigationUrl = "/management/personal_api_keys";

export const PersonalApiKeysTable = (props: RouteComponentProps) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<PersonalApiKey[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const deleteActions = (
    rows: PersonalApiKey[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<PersonalApiKey>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.name}>
          <NavLink to={`${navigationUrl}/${row.prefix}`}>
            {!row.name ? "(empty name)" : row.name}
          </NavLink>
        </span>
      ),
      orderingField: null,
    },
    {
      titleRenderFunction: () => "Scope",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.scope}>
          {row.scope}
        </span>
      ),
      orderingField: null,
    },
    {
      titleRenderFunction: () => "Created on",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.created}>
          {row.created}
        </span>
      ),
      orderingField: null,
    },
    {
      titleRenderFunction: () => "", //"Actions",
      renderFunction: (
        row,
        _updateTableRow,
        triggerReloadWithCurrentPage,
        triggerReloadWithBasePage
      ) => {
        return (
          <TableActionButtons
            tableRow={row}
            triggerReloadWithCurrentPage={triggerReloadWithCurrentPage}
            triggerReloadWithBasePage={triggerReloadWithBasePage}
            editUrl={`${navigationUrl}/${row.prefix}`}
            actions={[
              {
                displayValue: "Delete",
                actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                  deleteActions([row], triggerReloadWithCurrentPage, null);
                },
              },
            ]}
          />
        );
      },
      orderingField: null,
    },
  ];

  const handleNewClick = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={personalApiKeysIcon}
      imgAltDescription={"Personal API keys icon"}
      headerText={"Personal API keys"}
      explanationText={personalApiKeysFormHelpText["default"]}
      backUrl={"/management"}
    >
      <TableStateContainer
        gridTemplateColumns={"44% 24% 24% 8%"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        checkBoxActions={[]}
        newItemOnClick={handleNewClick}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[
            { name: "name", width: 65 },
            { name: "prefix", width: 35 },
          ]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setRowsToBeDeleted([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
};
