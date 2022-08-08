import React from 'react';
import styles from './Difficulty.module.css';
import starFull from '../../img/svg/star-complete.svg';
import starEmpty from '../../img/svg/star-empty.svg';

interface DifficultyInterface {
  difficulty: string;
}

const Difficulty: React.FC<DifficultyInterface> = ({difficulty}) => {
  let difficultyNumber = 1;
  const difficultyArray = [];
  switch (difficulty) {
    case 'easy':
      difficultyNumber = 1;
      break;
    case 'medium':
      difficultyNumber = 2;
      break;
    case 'hard':
      difficultyNumber = 3;
      break;
    default:
      difficultyNumber = 1;
  }
  
  
  for (let index = 0; index < 3; index++) {
    if((index + 1) > difficultyNumber) {
      difficultyArray.push('none')
    }else{
      difficultyArray.push('star')
    }
    
  }
  return (
    <div className={styles.container}>
      {difficultyArray.map(d => {
        if(d === "star"){
          return <img src={starFull} key={Math.random().toString()} alt="star"/>
        }else{
          return <img src={starEmpty} key={Math.random().toString()} alt="star"/>
        }
      })}
    </div>
  )
}

export default Difficulty