import React, { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { SLICE_NAMES } from '../../constants/enums';
import useUser from '../../api/useUser';
import { logoutUser } from '../../store/reducers/userSlice';
import { errorToast } from '../../lib/toast';

const Header = () => {
  const APPUSER = useSelector(state => state[SLICE_NAMES.USER]);
  const navigate = useNavigate();
  const {logoutLoading, logout, getCurrentUser} = useUser();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null)

  const getLogout = () => {
    logout((res, err) => {
      if (err) {
        errorToast("Error logging out");
        return;
      }
      dispatch(logoutUser());
      location.reload();
    })
  }

  const getUser = async() => {
    await getCurrentUser((res, err) => {
      if(err){
        errorToast("Error fetching user details");
        return;
      }
      setUser(res.data);
    })
  }

  useEffect(()=>{
    if(APPUSER) getUser();
  }, [APPUSER]);

  return (
    <div className= {styles.header}>
        <div className={styles.logo} onClick={()=> navigate("/")}>
            <img src="/assets/logo.svg" alt="logo" draggable = "false"/>
            <p>WeTube</p>
        </div>
        <div className= {styles.search}>
            <div className={styles.searchBox}>
              <img src="/assets/search-lg.svg" alt="search" draggable = "false"/>
              <input type="text" placeholder='Search'/>
            </div>
        </div>
        <div className={styles.authControls}>
          {APPUSER ? (
            <>
              <img src={user?.avatar|| "/assets/loadingAvatar.svg"} alt="avatar" onClick={()=> navigate("/profile")}/>
              <button className={styles.signIn} onClick = {getLogout}>Logout</button>
            </>
          ) : (
            <>
            <button className={styles.signIn} onClick = {()=>navigate('/login')}>Sign in</button>
          <button className={styles.signUp} onClick = {()=>navigate('/register')}>Sign up</button>
            </>
          )}
        </div>
    </div>
  )
}

export default Header