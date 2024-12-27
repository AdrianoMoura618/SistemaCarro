import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Nav = styled.nav`
  background: #333;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 6px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin-right: 1rem;
  &:hover { color: #ddd; }
`;

export default function Navbar() {
  return (
    <Nav>
      <NavLink to="/">Carros</NavLink>
      <NavLink to="">|</NavLink>
      <NavLink to="/add-car">Adicionar Carro</NavLink>
      <NavLink to="">|</NavLink>
      <NavLink to="/add-model">Adicionar Modelo</NavLink>
      <NavLink to="">|</NavLink>
      <NavLink to="/add-brand">Adicionar Marca</NavLink>
    </Nav>
  );
}