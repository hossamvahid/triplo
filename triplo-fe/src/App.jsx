import { useState } from 'react'
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Layout from './Components/Layout';
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage';
import { Rotate3D } from 'lucide-react';
import RegisterPage from './Pages/RegisterPage';
import ProfilePage from './Pages/ProfilePage';
import AccomodationsPage from './Pages/AccomodationsPage';
import AccomodationDetailsPage from './Pages/AccomodationDetailsPage';


function App() {

  return (
    <>
      <React.StrictMode>
        <Router>
          <Routes>

             <Route path="/" element={<Layout> <HomePage/> </Layout>}></Route>
             <Route path="/login" element={<Layout><LoginPage/></Layout>}></Route>
             <Route path="/register" element={<Layout><RegisterPage/></Layout>}></Route>
             <Route path="/profile" element={<Layout><ProfilePage/></Layout>}></Route>
             <Route path="/accomodations" element={<Layout><AccomodationsPage/></Layout>}></Route>
             <Route path="/accomodation/:id" element={<Layout><AccomodationDetailsPage/></Layout>}></Route>


          </Routes>
        </Router>
      </React.StrictMode>
    </>
  )
}

export default App
