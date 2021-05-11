import React from 'react';
import styles from './Pagination.module.css';
import paginationArrowIcon from '../images/pagination_arrow.svg';
// import { FormattedMessage, } from "react-intl";

interface Props {
  page1Url: string;
  previousUrl: string | null;
  nextUrl: string | null;
  itemsPerPage: number;
  reloadFromUrl: (url: string)=> void;
  setItemsPerPage: (amountItems: number)=> void;
}

const Pagination: React.FC<Props> = ({page1Url,previousUrl, nextUrl, itemsPerPage, reloadFromUrl, setItemsPerPage}) => {
  return (
      <div  className={styles.Pagination}
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <button title={"to first page"} disabled={previousUrl===""} onClick={()=>reloadFromUrl(page1Url)}>
            <img alt="" style={{transform:"scaleX(-1"}} src={paginationArrowIcon}/>
            <img alt="to first page" style={{transform:"scaleX(-1"}} src={paginationArrowIcon}/>
          </button>
          <button disabled={!previousUrl} onClick={() => previousUrl && reloadFromUrl(previousUrl)}>
            <img alt="to previous page" style={{transform:"scaleX(-1"}} src={paginationArrowIcon}/>
          </button>
          <button disabled={!nextUrl} onClick={() => nextUrl && reloadFromUrl(nextUrl)}>
            <img alt="to next page" src={paginationArrowIcon}/>
          </button>
          <label>
            
            {/* <FormattedMessage
                id="pagination.label_items_per_page"
                defaultMessage="Items per page:"
            /> */}
            Items per page:
            <select
              value={itemsPerPage}
              onChange={event => setItemsPerPage(parseInt(event.target.value))}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="40">40</option>
            </select>
          </label>
        </div>
        
      </div>
  )
};

export default Pagination;