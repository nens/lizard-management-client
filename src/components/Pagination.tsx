import React from 'react';
import styles from './Pagination.module.css';
import paginationArrowIcon from '../images/pagination_arrow.svg';

interface Props {
  toPage1?: () => void;
  toPrevious?: () => void;
  toNext?: () => void;

  itemsPerPageChoices?: number[];
  itemsPerPage?: number;
  setItemsPerPage?: (amount: number) => void;
}

const Pagination: React.FC<Props> = ({
  toPage1,
  toPrevious,
  toNext,
  itemsPerPageChoices = [10, 20, 40],
  itemsPerPage,
  setItemsPerPage
}) => {
  return (
      <div className={styles.Pagination}
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <button title={"to first page"} disabled={toPage1 === undefined} onClick={toPage1}>
            <img alt="" style={{transform:"scaleX(-1"}} src={paginationArrowIcon}/>
            <img alt="to first page" style={{transform:"scaleX(-1"}} src={paginationArrowIcon}/>
          </button>
          <button disabled={toPrevious === undefined} onClick={toPrevious}>
            <img alt="to previous page" style={{transform:"scaleX(-1"}} src={paginationArrowIcon}/>
          </button>
          <button disabled={toNext === undefined} onClick={toNext}>
            <img alt="to next page" src={paginationArrowIcon}/>
          </button>
          {setItemsPerPage !== undefined ? (
            <label>
              Items per page:
              <select
                value={itemsPerPage}
                onChange={event => setItemsPerPage!(parseInt(event.target.value))}
              >
                {itemsPerPageChoices.map((choice) => (
                  <option key={choice} value={choice}>{choice}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>
  )
};

export default Pagination;
