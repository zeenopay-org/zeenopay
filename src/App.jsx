import React  from 'react';
import {  Outlet } from "react-router-dom";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      
      <Footer />
    </>
  );
}

export default App;
