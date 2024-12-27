import React from 'react';
import styled from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import CarList from './components/CarList';
import CarForm from './components/CarForm';
import ModelForm from './components/ModelForm';
import BrandForm from './components/BrandForm';


const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Roboto", serif;
  font-weight: 400;
`;

export default function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<CarList />} />
          <Route path="/add-car" element={<CarForm />} />
          <Route path="/add-model" element={<ModelForm />} />
          <Route path="/add-brand" element={<BrandForm />} />
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}
