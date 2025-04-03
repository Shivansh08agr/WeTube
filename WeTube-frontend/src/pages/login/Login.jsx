import React, { useState } from 'react'
import styles from './Login.module.scss'
import { Link, useNavigate } from "react-router-dom";
import useUser from './../../api/useUser';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/reducers/userSlice';
import { errorToast } from '../../lib/toast';

const Login = () => {
    const {login, userLoading} = useUser();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    function handleChange(e) {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      }
      function handleSubmit(e) {
        e.preventDefault();
        const payload = {
          ...formData,
        };
        login(payload, (res, err) => {
          if (err) {
            console.error("Error logging in user:", err);
            errorToast("Error logging in user")
            return;
          }
          dispatch(setUser(res.data));
        });
        navigate('/')
      }
  return (
    <div className={styles.login}>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" name="email" onChange = {handleChange}/>
        <input
          type="password"
          placeholder="password (min 6 characters)"
          name="password"
          onChange = {handleChange}
        />
        <button type="submit" disabled={userLoading}>
          {userLoading ? "Signing in..." : "Sign in"}
        </button>
        <p>Not a user? <Link to='/register' className={styles.not_a_member}>Sign up</Link></p>
      </form>
    </div>
  )
}

export default Login