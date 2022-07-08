import React from 'react';
import styles from './SelectProfiles.module.css';
import { ProfileDataSelect } from '../../types/classes';

interface SelectProfilesInterface {
  profilesData: ProfileDataSelect[],
  handleChooseProfile: (index: number) => void
}

const SelectProfiles: React.FC<SelectProfilesInterface> = ({profilesData, handleChooseProfile}) => {

  const handleProfileSelect = (profile: ProfileDataSelect, index: number) => {
    handleChooseProfile(index);
  }

  return (
    <article className={styles['profiles-container']}>
      <header>
        <h3>Choose your Profile</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </header>
      <div className={styles.profiles}>
        {profilesData.map((profile, index) => (
          <div
            onClick={handleProfileSelect.bind(null, profile, index)} 
            key={profile.name} 
            className={`${styles.profile} ${profile.isChecked ?  styles.checked : ''}`}>
              <div 
                className={styles['profile-image-container']}
                style={{
                  background: `var(--${profile.name.toLowerCase()})`
                }}
              >
                <img src={profile.img} alt="" />
              </div>
            <aside>
              <h3>{profile.name}</h3>
              <p>{profile.description}</p>
            </aside>
          </div>
        ))}
      </div>
    </article>
  )
}

export default SelectProfiles