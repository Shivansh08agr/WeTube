import React from 'react'
import Header from '../components/header/Header'
import Sidebar from '../components/sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <>
    <Header/>
    <div style={{
      display: "flex",
      width: "100%",
      height: 'calc(100% - 4rem)'
    }}>
      <Sidebar/>
      <Outlet/>
    </div>
    <ToastContainer style={{backgroundColor: "transparent"}}/>
    </>
  )
}

export default Layout