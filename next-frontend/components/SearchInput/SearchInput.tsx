import React from 'react';
import { RiSearchLine } from 'react-icons/ri'; 
import styles from './SearchInput.module.css';
import { SearchInputProps } from './SearchInput.types';

const SearchInput = ({ onChange, placeholder }: SearchInputProps) => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        onChange={onChange}
      />
      <div className={styles.searchIcon}>
        <RiSearchLine />
      </div>
    </div>
  );
}

export default SearchInput;
