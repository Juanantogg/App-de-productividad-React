import React from 'react'
import logo from '../logo.svg'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { showModalAction } from '../store/actions/toggleModal'
import { createTask } from '../store/actions/crudTask'

const Header = ({ showModal, createTask }) => {
  const filter = 'Todas'

  const fillTasksList = () => {
    let count = 1
    const interval = setInterval(() => {
      const newTask = {
        name: `Tarea-${count}`,
        description: `Descripción de tarea-${count}`,
        duration: setRandomTime(),
        active: false,
        order: 0,
        completed: false,
        running: false,
        created: new Date()
      }

      createTask(newTask)

      count++

      if (count > 50) {
        clearInterval(interval)
      }
    }, 200)
  }

  const setRandomTime = () => {
    let randomH = 0
    let randomM = 0
    let randomS = 0
    let time = ''

    do {
      randomH = Math.floor(Math.random() * 2)
    } while (randomH > 2)

    do {
      randomM = Math.floor(Math.random() * 60)
    } while (randomM > 60)

    do {
      randomS = Math.floor(Math.random() * 60)
    } while (randomS > 60)

    time = `${
      randomH.toString().length < 2 ? `0${randomH}` : randomH
    }:${
      randomM.toString().length < 2 ? `0${randomM}` : randomM
    }:${
      randomS.toString().length < 2 ? `0${randomS}` : randomS
    }`

    return time
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='xl'>
        <Link className='nav-link p-0' to='/tasks'>
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
        </Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            <Link className='nav-link' to='/tasks'> Inicio </Link>
            <Link className='nav-link' to='/history'> Historial </Link>
            <Nav.Link onClick={showModal}> Nueva </Nav.Link>
            <Nav.Link onClick={fillTasksList}>Llenar Tareas</Nav.Link>
            <Nav.Link onClick={fillTasksList}>Llenar Hstorial</Nav.Link>
            <NavDropdown title={`Filtro: ${filter}`} id='basic-nav-dropdown'>
              <NavDropdown.Item>Todas</NavDropdown.Item>
              <NavDropdown.Item>Activas</NavDropdown.Item>
              <NavDropdown.Item>Inactivas</NavDropdown.Item>
              <NavDropdown.Item>Completadas</NavDropdown.Item>
              <NavDropdown.Item>Pedientes</NavDropdown.Item>
            </NavDropdown>
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
  showModal: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
  return {
    showModal: () => dispatch(showModalAction()),
    createTask: (task) => dispatch(createTask(task))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Header)
