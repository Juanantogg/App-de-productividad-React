import React from 'react'
import PropTypes from 'prop-types'
import logo from '../logo.svg'
import { Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap'

const Header = ({ showModal }) => {
  const filter = 'Todas'

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Navbar.Brand>
          <img
            alt='React Logo'
            src={logo}
            width='30'
            height='30'
            className='d-inline-block align-top mr-2'
          />
          App de productividad
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <NavDropdown title={`Filtro: ${filter}`} id='basic-nav-dropdown'>
              <NavDropdown.Item>Todas</NavDropdown.Item>
              <NavDropdown.Item>Completadas</NavDropdown.Item>
              <NavDropdown.Item>Pedientes</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={showModal}>Nueva tarea</Nav.Link>
          </Nav>
          <Form inline>
            <FormControl type='text' placeholder='Buscar' className='mr-sm-2' />
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

Header.propTypes = {
  showModal: PropTypes.func.isRequired
}

export default Header
