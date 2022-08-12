import React from 'react';
import styles from './UserThumbNail.module.css';
import { Link } from "react-router-dom";
import Arrow from '../UI/Arrow/Arrow';
import ProgressBar from '../ProgressBar/ProgressBar'
import { StudentType } from '../../types/user';
import firstMedal from '../../img/first.png';
import secondMedal from '../../img/second.png';
import thirdMedal from '../../img/third.png';

interface UserThumbNailInterface {
  rank: number;
  name: string;
  studentId: string;
  points: number;
  isTeacher: boolean;
  id: string;
  listItem?: boolean;
  user?: StudentType
}

const UserThumbNailContent: React.FC<UserThumbNailInterface> = ({ rank, name, studentId, points, id, isTeacher, listItem, user }) => {
  const setMedal = (position: number) => {
    switch (position) {
      case 1: 
        return <img src={firstMedal} alt="medal" />
      case 2: 
        return <img src={secondMedal} alt="medal" />
      case 3: 
        return <img src={thirdMedal} alt="medal" />
    }
  }
  return (
    <>
        {!listItem && <h2>{rank}</h2>}
        <div className={styles['user-thumb__info']}>
          <div className={styles['user-thumb__header']}>
            <h3>{name}</h3>
            <div className={styles['user-thumb__aside']}>
              <p><b>{points}</b> pt</p>
              {rank <= 3 && setMedal(rank)}
            </div>
          </div>
          {isTeacher && 
            <>
              <div className={styles['user-thumb__footer']}>
                <p>{studentId}</p>
                <Arrow right black={rank <= 3}/>
              </div>
              {user && user.profile.name !== 'senpai' && <ProgressBar student={user}/>}
            </>
          }
        </div>
    </>
  )
}

const UserThumbNail: React.FC<UserThumbNailInterface> = ({ rank, name, studentId, points, id, isTeacher, listItem, user }) => {
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
            user={user}
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