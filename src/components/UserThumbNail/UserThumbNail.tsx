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
}

const UserThumbNailContent: React.FC<UserThumbNailInterface> = ({ rank, name, studentId, points, id, isTeacher }) => {
  return (
    <>
        <h2>{rank}</h2>
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

const UserThumbNail: React.FC<UserThumbNailInterface> = ({ rank, name, studentId, points, id, isTeacher }) => {
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

  const styleVar = `${styles['user-thumb']} ${rank <= 3 ? styles['user-thumb--podium'] : ''} ${setRankPositionColor(rank)}`;
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
          />
        </div> 
      }
    </>
  )
}

export default UserThumbNail