import React from 'react';
import styles from './Pagination.module.css';

interface Props {
  page1Url: string;
  previousUrl: string;
  nextUrl: string;
  itemsPerPage: string;
  reloadFromUrl: (url: string)=> void;
  setItemsPerPage: (amountItems: string)=> void;
}

const Pagination: React.FC<Props> = ({page1Url,previousUrl, nextUrl, itemsPerPage, reloadFromUrl, setItemsPerPage}) => {
  return (
      <div  className={styles.Pagination}>
        <button disabled={previousUrl===""} onClick={()=>reloadFromUrl(page1Url)}>Page 1</button>
        <button disabled={previousUrl===""} onClick={()=>reloadFromUrl(previousUrl)}>Previous</button>
        <button disabled={nextUrl===""} onClick={()=>reloadFromUrl(nextUrl)}>Next</button>
        <label>Items per page
          <select
            value={itemsPerPage}
            onChange={event=>{
              setItemsPerPage(event.target.value)
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
          </select>
        </label>
      </div>
  )
};

export default Pagination;