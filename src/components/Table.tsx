import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Table.module.css";
import actionListStyles from "./ActionList.module.css";
import { DataRetrievalState } from "../types/retrievingDataTypes";
import MDSpinner from "react-md-spinner";

export interface ColumnDefinition<TableRowType> {
  titleRenderFunction: () => string | JSX.Element;
  renderFunction: (
    row: TableRowType,
    updateTableRow: (row: TableRowType) => void,
    triggerReloadWithCurrentPage: () => void,
    triggerReloadWithBasePage: () => void
  ) => string | JSX.Element;
  orderingField: string | null;
}

interface Props<TableRowType> {
  tableData: TableRowType[];
  setTableData: (data: TableRowType[]) => void;
  gridTemplateColumns: string;
  columnDefinitions: ColumnDefinition<TableRowType>[];
  dataRetrievalState: DataRetrievalState;
  triggerReloadWithCurrentPage: () => void;
  triggerReloadWithBasePage: () => void;
  getIfCheckBoxOfUuidIsSelected?: (uuid: string) => boolean;
  responsive?: boolean;
}

function Table<TableRowType extends { uuid: string }>(
  props: PropsWithChildren<Props<TableRowType>>
) {
  const {
    tableData,
    setTableData,
    gridTemplateColumns,
    columnDefinitions,
    dataRetrievalState,
    triggerReloadWithCurrentPage,
    triggerReloadWithBasePage,
    getIfCheckBoxOfUuidIsSelected,
    responsive,
  } = props;

  ///////////////////////////
  // Below code is to check if table is overflow and scrollbar is visible
  // Vertical scrollbar takes palce and causes table header and table body no longer alinged with each other
  // The solution is to check if the table body is overflow and apply a padding-right to the table header
  // the value of padding-right is the scroll width which is the offsetWidth - clientWidth
  const tableRef = useRef<HTMLDivElement>(null);
  const tableRefElement = tableRef.current;
  const scrollbarWidth = tableRefElement
    ? tableRefElement.offsetWidth - tableRefElement.clientWidth
    : undefined;

  const [tableIsOverflow, setTableIsOverflow] = useState<boolean>(false);

  // React.useCallback is used to call the setTableIsOverflow as setTableIsOverflow cannot be called directly inside the useEffect
  const callbackToSetTableOverflow = useCallback(() => setTableIsOverflow(true), []);
  const callbackToSetTableNotOverflow = useCallback(() => setTableIsOverflow(false), []);

  useEffect(() => {
    if (tableRefElement) {
      if (tableRefElement.clientHeight < tableRefElement.scrollHeight) {
        // table is overflow if clientHeight < scrollHeight
        callbackToSetTableOverflow();
      } else {
        callbackToSetTableNotOverflow();
      }
    }
  });
  // END OF SOLUTION
  ///////////////////////////

  return (
    <div className={styles.Table}>
      <div
        style={{
          gridTemplateColumns: gridTemplateColumns,
          paddingRight: tableIsOverflow ? scrollbarWidth : undefined,
          minWidth: responsive ? "unset" : undefined,
        }}
      >
        {columnDefinitions.map((definition, i) => (
          <span key={i}>{definition.titleRenderFunction()}</span>
        ))}
      </div>
      <div
        style={{
          gridTemplateColumns: gridTemplateColumns,
          minWidth: responsive ? "unset" : undefined,
        }}
        ref={tableRef}
      >
        {tableData.map((tableRow, idx) => {
          const rowIsSelected =
            getIfCheckBoxOfUuidIsSelected && getIfCheckBoxOfUuidIsSelected(tableRow.uuid);
          const updateTableRow = (newTableRow: typeof tableRow) => {
            const newTableData = tableData.map((rowAllTables) => {
              if (rowAllTables.uuid === tableRow.uuid) {
                return { ...newTableRow };
              } else {
                return { ...rowAllTables };
              }
            });
            setTableData(newTableData);
          };
          return (
            <React.Fragment key={idx}>
              {columnDefinitions.map((definition, i) => (
                <span
                  className={`${rowIsSelected ? styles.Selected : ""} ${
                    tableData.length > 1 &&
                    idx === tableData.length - 1 &&
                    i === columnDefinitions.length - 1
                      ? actionListStyles.LastItemInTable
                      : ""
                  }`}
                  key={idx + i}
                >
                  {definition.renderFunction(
                    tableRow,
                    updateTableRow,
                    triggerReloadWithCurrentPage,
                    triggerReloadWithBasePage
                  )}
                </span>
              ))}
            </React.Fragment>
          );
        })}
      </div>
      <div>
        <div className={styles.TableSpinner}>
          {dataRetrievalState === "NEVER_DID_RETRIEVE" || dataRetrievalState === "RETRIEVING" ? (
            // "LOADING"
            <MDSpinner size={96} />
          ) : dataRetrievalState === "RETRIEVED" && tableData.length === 0 ? (
            "No data found for with current filter"
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Table;
