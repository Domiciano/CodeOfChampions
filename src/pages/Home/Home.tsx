import React, { useEffect } from 'react';
import LogOut from '../../components/LogOut/LogOut';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userAuthInitStateType } from '../../store/userAuth-slice';

const Home = () => {
  const isLoggedIn = useSelector((state: {userAuth: userAuthInitStateType}) => state?.userAuth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <LogOut/>
      Home Pri
    </div>
  )
}

export default Home