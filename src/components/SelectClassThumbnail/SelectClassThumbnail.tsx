import React from 'react';
import styles from './SelectClassThumbnail.module.css';

interface SelectClassThumbnailInterface {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  teacher: string; 
  term: string;
  schedule: string;
}

const SelectClassThumbnail: React.FC<SelectClassThumbnailInterface> = ({ onClick, teacher, term, schedule }) => {
  return (
    <div className={styles['select-class-thumb']} onClick={onClick}>
      <div className={styles['select-class-thumb__header']}>
        <h3>{teacher}</h3>
        <p>{term}</p>
      </div>
      <p className={styles['select-class-thumb__footer']}>{schedule}</p>
    </div>
  )
}

export default SelectClassThumbnail