import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Modal, Form, Button } from 'react-bootstrap'

const AddTask = ({ show, showModal }) => {
  let newTask = {
    name: '',
    description: '',
    hours: 0,
    minutes: 0
  }

  const [isStandard, setIsStandard] = useState(false)
  const [hours, setHours] = useState(0)

  const changeTypeDuration = () => setIsStandard(!isStandard)

  const saveTask = (e) => {
    console.log(newTask)
  }

  const handleChange = e => {
    newTask = {
      ...newTask,
      [e.target.name]: e.target.value
    }
  }

  const changeHours = (e) => {
    if (e.target.value > 2) {
      setHours(2)
      e.target.value = 2
    }
    if (e.target.value < 0) {
      newTask.hours = 0
      e.target.value = 0
    }
  }

  const changeMinutes = (e) => {
    console.log(e.target.value)
    if (e.target.value > 59) {
      if (newTask.hours < 2) {
        e.target.value = 0
        newTask.minutes = e.target.value
        setHours(hours + 1)
      }
    }
  }

  return (
    <Modal show={show} onHide={showModal}>
      <Modal.Header closeButton>
        <Modal.Title>Nueva tarea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate className='new-task'>
          <Form.Group controlId='name'>
            <Form.Label>Nombre</Form.Label>
            <Form.Control name='name' onChange={handleChange} type='text' placeholder='Escribe el nombre de la nueva tarea' />
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Descripción</Form.Label>
            <Form.Control name='description' onChange={handleChange} as='textarea' rows='3' placeholder='Escribe la descripción de la nueva tarea' />
          </Form.Group>

          <Form.Group controlId='duration'>
            <Form.Label className='d-flex justify-content-between'>
              Duración
              <div>
                <Form.Check inline name='typeDuration' onChange={changeTypeDuration} label='Estándar' type='radio' id='standard' defaultChecked />
                <Form.Check inline name='typeDuration' onChange={changeTypeDuration} label='Personalizado' type='radio' id='custom' />
              </div>
            </Form.Label>
            {
              isStandard
                ? <Form.Control name='duration' onChange={handleChange} as='select'>
                  <option value='30:00'>Corta: 30 minutos</option>
                  <option value='45:00'>Media: 45 minutos</option>
                  <option value='60:00'>Larga: 60 minutos</option>
                </Form.Control>
                : <div className='d-flex'>
                  <Form.Control onChange={changeHours} type='number' defaultValue={hours} min='0' max='2'></Form.Control>
                  <p className='m-2'>:</p>
                  <Form.Control onChange={changeMinutes} type='number' defaultValue={newTask.minutes}></Form.Control>
                </div>
                // <Form.Control name='duration' onChange={handleChange} className='text-center' value='30:00' type='time' min='02:00' max='00:00'></Form.Control>
                // <input name='duration' onChange={handleChange} className='text-center' value='30:00' type='time' min='02:00' max='00:00' />
            }
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={showModal}>
          Cancelar
        </Button>
        <Button variant='success' onClick={saveTask}>
          Agregar tarea
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

AddTask.propTypes = {
  show: PropTypes.bool.isRequired,
  showModal: PropTypes.func.isRequired
}

export default AddTask
