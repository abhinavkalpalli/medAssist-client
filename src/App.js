// src/App.js
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import '../src/index.css'
import Doctorroute from './Routes/DoctorRoutes';
import AdminRoutes from './Routes/AdminRoutes';
import PatientRoute from './Routes/PatientRoutes';
import AuthRoutes from './Routes/authRoutes';
import { Toaster } from "react-hot-toast";




function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path={"/*"} element={<AuthRoutes/>}/>
      <Route path={"/admin/*"} element={<AdminRoutes/>}/>
      <Route path={"/patient/*"} element={<PatientRoute/>}/>
      <Route path={"/doctor/*"} element={<Doctorroute/>}/>
    </Routes>
    </>
  );
}

export default App;
