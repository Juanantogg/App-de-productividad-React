import React, { useState } from 'react'
import logo from '../logo.svg'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { showModalAction } from '../store/actions/toggleModal'
import { createTask } from '../store/actions/crudTask'
import { setFilterTasks, setSearch } from '../store/actions/filter'

const Header = ({ showModal, createTask, setFilterTasks, setSearch }) => {
  const [filter, setFilter] = useState('Todas')
  const [path, setPath] = useState(window.location.pathname)

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

  const filterTasks = (filterAction) => {
    setFilter(filterAction)
    setFilterTasks(filterAction)
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' fixed='top'>
        <Link className='nav-link p-0' to='/tasks' onClick={() => setPath('/tasks')}>
          <Navbar.Brand>
            <img alt='React Logo' src={logo} width='30' height='30' className='d-inline-block align-top mr-2' />
          App de productividad
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>
            {/* {menuItems} */}
            {
              path === '/tasks' ? (
                <>
                  <Link className='nav-link' to='/history' onClick={() => setPath('/history')}> Historial </Link>
                  <Nav.Link onClick={showModal}> Nueva Tarea </Nav.Link>
                  <Nav.Link onClick={fillTasksList}>Llenar Tareas</Nav.Link>
                  <NavDropdown title={`Filtro: ${filter}`} id='basic-nav-dropdown'>
                    <NavDropdown.Item onClick={() => filterTasks('Todas')}>Todas</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => filterTasks('Activas')}>Activas</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => filterTasks('Inactivas')}>Inactivas</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => filterTasks('Completadas')}>Completadas</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => filterTasks('Pendientes')}>Pedientes</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => filterTasks('Ejecutandose')}>Ejecutandose</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => filterTasks('Pausadas')}>Pausadas</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={() => filterTasks('Menos de 30 min')}>Menos de 30 min</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => filterTasks('De 30 min a 1 hr')}>De 30 min a 1 hr</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => filterTasks('Más de 1 hr')}>Más de 1 hr</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Link className='nav-link' to='/tasks' onClick={() => setPath('/tasks')}> Inicio </Link>
                  <Nav.Link onClick={fillTasksList}>Llenar Hstorial</Nav.Link>
                </>
              )
            }
          </Nav>
          {/* {
            path === '/tasks' && (
              <Form inline>
                <FormControl type='text' placeholder='Busca una tarea' onKeyUp={(e) => setSearch(e.target.value)} className='mr-sm-2' />
              </Form>
            )
          } */}
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

Header.propTypes = {
  showModal: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  setFilterTasks: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
  return {
    showModal: () => dispatch(showModalAction()),
    createTask: (task) => dispatch(createTask(task)),
    setFilterTasks: (filter) => dispatch(setFilterTasks(filter)),
    setSearch: (search) => dispatch(setSearch(search))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Header)
