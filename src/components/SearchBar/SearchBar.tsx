import React from 'react';
import styles from './SearchBar.module.css';
import searchIcon from '../../img/svg/search.svg';

interface SearchBarInterface {

}

const SearchBar: React.FC<SearchBarInterface> = () => {
  return (
    <div className={styles['search-bar']}>
      <img src={searchIcon} alt="search icon" />
      <input type="text" placeholder="Search" />
    </div>
  )
}

export default SearchBar