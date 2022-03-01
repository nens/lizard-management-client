import React, { useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { ExplainSideColumn } from "../../components/ExplainSideColumn";
import { layerCollectionTableHelpText } from "../../utils/help_texts/helpTextForLayercollections";
import AuthorisationModal from "../../components/AuthorisationModal";
import { fetchWithOptions } from "../../utils/fetchWithOptions";
import TableActionButtons from "../../components/TableActionButtons";
import TableStateContainer from "../../components/TableStateContainer";
import DeleteModal from "../../components/DeleteModal";
import tableStyles from "../../components/Table.module.css";
import layerCollectionIcon from "../../images/layer_collection_icon.svg";
import { getAccessibiltyText } from "../../form/AccessModifier";
import { ColumnDefinition } from "../../components/Table";
import { Layercollection } from "../../api/rasters";

export const baseUrl = `/api/v4/layercollections/`;

export const LayerCollectionsTable = (props: RouteComponentProps) => {
  const navigationUrl = "/management/data_management/layer_collections";

  const [selectedRowsForChangeRights, setSelectedRowsForChangeRights] = useState<Layercollection[]>(
    []
  );
  const [resetTable, setResetTable] = useState<Function | null>(null);
  const [selectedRowsForDeletion, setSelectedRowsForDeletion] = useState<Layercollection[]>([]);

  const deleteActions = (
    rows: Layercollection[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setSelectedRowsForDeletion(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<Layercollection>[] = [
    {
      titleRenderFunction: () => "Slug",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.slug}>
          <NavLink to={`${navigationUrl}/${row.slug}`}>{row.slug}</NavLink>
        </span>
      ),
      orderingField: "slug",
    },
    {
      titleRenderFunction: () => "Accessibility",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.access_modifier}>
          {getAccessibiltyText(row.access_modifier)}
        </span>
      ),
      orderingField: "access_modifier",
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
            editUrl={`${navigationUrl}/${row.slug}`}
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
      imgUrl={layerCollectionIcon}
      imgAltDescription={"Layer collection icon"}
      headerText={"Layer collections"}
      explanationText={layerCollectionTableHelpText}
      backUrl={"/management/data_management"}
    >
      <TableStateContainer
        gridTemplateColumns={"10fr 60fr 20fr 10fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        checkBoxActions={[
          {
            displayValue: "Change rights",
            actionFunction: (
              rows,
              _tableData,
              _setTableData,
              triggerReloadWithCurrentPage,
              _triggerReloadWithBasePage,
              setCheckboxes
            ) => {
              setSelectedRowsForChangeRights(rows);
              setResetTable(() => () => {
                triggerReloadWithCurrentPage();
                setCheckboxes([]);
              });
            },
          },
          {
            displayValue: "Delete",
            actionFunction: (
              rows,
              _tableData,
              _setTableData,
              triggerReloadWithCurrentPage,
              _triggerReloadWithBasePage,
              setCheckboxes
            ) => {
              deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes);
            },
          },
        ]}
        newItemOnClick={handleNewClick}
        filterOptions={[
          {
            value: "slug__icontains=",
            label: "Slug",
          },
        ]}
      />
      {selectedRowsForDeletion.length > 0 ? (
        <DeleteModal
          rows={selectedRowsForDeletion}
          displayContent={[{ name: "slug", width: 40 }]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setSelectedRowsForDeletion([]);
            setResetTable(null);
          }}
          text={"You are deactivating the following layer collection."}
        />
      ) : null}
      {selectedRowsForChangeRights.length > 0 ? (
        <AuthorisationModal
          rows={selectedRowsForChangeRights}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setSelectedRowsForChangeRights([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
};
