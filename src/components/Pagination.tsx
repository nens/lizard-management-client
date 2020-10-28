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
      <div  className={styles.Pagination}
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div>
          <button disabled={previousUrl===""} onClick={()=>reloadFromUrl(page1Url)}>{"<|"}</button>
          <button disabled={previousUrl===""} onClick={()=>reloadFromUrl(previousUrl)}>{"<"}</button>
          <button disabled={nextUrl===""} onClick={()=>reloadFromUrl(nextUrl)}>{">"}</button>
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
        
      </div>
  )
};

export default Pagination;