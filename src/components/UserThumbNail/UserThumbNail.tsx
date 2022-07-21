import React from 'react';
import styles from './UserThumbNail.module.css';
import { Link } from "react-router-dom";
import Arrow from '../UI/Arrow/Arrow';

interface UserThumbNailInterface {
  rank: number;
  name: string;
  studentId: string;
  points: number;
  isTeacher: boolean;
  id: string;
  listItem?: boolean;
}

const UserThumbNailContent: React.FC<UserThumbNailInterface> = ({ rank, name, studentId, points, id, isTeacher, listItem }) => {
  return (
    <>
        {!listItem && <h2>{rank}</h2>}
        <div className={styles['user-thumb__info']}>
          <div className={styles['user-thumb__header']}>
            <h3>{name}</h3>
            <p><b>{points}</b> pt</p>
          </div>
          {isTeacher && 
            <div className={styles['user-thumb__footer']}>
              <p>{studentId}</p>
              <Arrow right black={rank <= 3}/>
            </div>
          }
        </div>
    </>
  )
}

const UserThumbNail: React.FC<UserThumbNailInterface> = ({ rank, name, studentId, points, id, isTeacher, listItem }) => {
  const setRankPositionColor = (rankPosition: number) => {
    switch (rankPosition) {
      case 1:
        return styles['first'];
      case 2:
        return styles['second'];
      case 3:
        return styles['third'];
      default:
        return ''
    }
  }

  const styleVar = `${styles['user-thumb']} ${(rank <= 3 && !listItem) ? styles['user-thumb--podium'] : ''} ${!listItem ? setRankPositionColor(rank) : ''}`;
  return (
    <>
      { isTeacher ? 
        <Link className={styleVar} to={`/evaluate-student/${id}`}>
          <UserThumbNailContent 
            rank={rank} 
            name={name} 
            studentId={studentId} 
            points={points} 
            isTeacher={isTeacher} 
            id={id}
            listItem={listItem}
          />
        </Link>
        : 
        <div className={styleVar}>
          <UserThumbNailContent 
            rank={rank} 
            name={name} 
            studentId={studentId} 
            points={points} 
            isTeacher={isTeacher} 
            id={id}
            listItem={listItem}
          />
        </div> 
      }
    </>
  )
}

export default UserThumbNail