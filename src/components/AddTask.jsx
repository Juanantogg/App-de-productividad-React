import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Form, Button } from 'react-bootstrap'
import { createTask, getTask, updateTask, removeTaskToUpdate } from '../store/actions/crudTask'
import { hideModalAction } from '../store/actions/toggleModal'

const AddTask = ({ createTask, hideModal, show, id, getTaskToUpdate, taskToUpdate, removeTaskToUpdate, update }) => {
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [isStandard, setIsStandard] = useState(true)
  const [duration, setDuration] = useState('00:30:00')

  const changeDuration = ({ target: { value } }) => {
    let [hours, minutes, seconds] = value.split(':')

    if (Number(hours) >= 2) {
      hours = '02'
      minutes = '00'
      seconds = '00'
    }

    Number(hours) <= 0 && (hours = '00')
    seconds || (seconds = '00')
    setDuration(`${hours}:${minutes}:${seconds}`)
  }

  const closeModal = () => {
    hideModal()
    removeTaskToUpdate()
  }

  const saveTask = (e) => {
    if (taskName) {
      const newTask = {
        name: taskName,
        description: taskDescription,
        duration: duration,
        order: 0,
        active: false,
        completed: false,
        running: false,
        created: new Date()
      }

      createTask(newTask)
      setTaskName('')
      setTaskDescription('')
      setIsStandard(true)
      setDuration('00:30:00')
    }
  }

  const updateTask = () => {
    if (taskName) {
      const task = {
        ...taskToUpdate,
        name: taskName,
        description: taskDescription,
        duration: duration,
        created: taskToUpdate.created.toDate(),
        updated: new Date()
      }

      update(task)
      setTaskName('')
      setTaskDescription('')
      setIsStandard(true)
      setDuration('00:30:00')
    }
  }

  useEffect(() => {
    if (id) {
      getTaskToUpdate(id)
      setIsStandard(false)
    }

    if (taskToUpdate) {
      const { name, description, duration } = taskToUpdate
      setTaskName(name)
      setTaskDescription(description)
      setDuration(duration)
    } else {
      setTaskName('')
      setTaskDescription('')
      setIsStandard(true)
      setDuration('00:30:00')
    }
  }, [taskToUpdate, id, getTaskToUpdate])

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        {
          taskToUpdate
            ? <Modal.Title>Actualizar tarea</Modal.Title>
            : <Modal.Title>Nueva tarea</Modal.Title>
        }
      </Modal.Header>
      <Modal.Body>
        <Form noValidate className='new-task'>
          <Form.Group controlId='name'>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name='name'
              onChange={({ target: { value } }) => setTaskName(value)}
              type='text'
              value={taskName}
              placeholder='Escribe el nombre de la nueva tarea'
            />
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              name='description'
              onChange={({ target: { value } }) => setTaskDescription(value)}
              as='textarea'
              rows='3'
              value={taskDescription}
              placeholder='Escribe la descripción de la nueva tarea'
            />
          </Form.Group>

          <Form.Group controlId='duration'>
            <Form.Label className='d-flex justify-content-between'>
              Duración
              <div>
                <Form.Check
                  inline
                  name='typeDuration'
                  onChange={() => setIsStandard(true)}
                  label='Estándar'
                  type='radio'
                  id='standard'
                  defaultChecked={!taskToUpdate}
                />
                <Form.Check
                  inline
                  name='typeDuration'
                  onChange={() => setIsStandard(false)}
                  label='Personalizado'
                  type='radio'
                  id='custom'
                  defaultChecked={taskToUpdate}
                />
              </div>
            </Form.Label>
            {
              isStandard
                ? (
                  <Form.Control name='duration' onChange={changeDuration} as='select'>
                    <option value='00:30:00'>Corta: 30 minutos</option>
                    <option value='00:45:00'>Media: 45 minutos</option>
                    <option value='01:00:00'>Larga: 60 minutos</option>
                  </Form.Control>
                )
                : (
                  <Form.Control
                    className='text-center'
                    name='duration'
                    onChange={changeDuration}
                    value={duration}
                    type='time'
                    step='1'
                  />
                )
            }
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={closeModal}>
            Cancelar
        </Button>
        {
          taskToUpdate
            ? (
              <Button variant='success' onClick={updateTask} disabled={!taskName}>
                Actualizar tarea
              </Button>
            )
            : (
              <Button variant='success' onClick={saveTask} disabled={!taskName}>
                Agregar tarea
              </Button>
            )
        }
      </Modal.Footer>
    </Modal>
  )
}

AddTask.propTypes = {
  createTask: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  id: PropTypes.string,
  getTaskToUpdate: PropTypes.func,
  taskToUpdate: PropTypes.object,
  removeTaskToUpdate: PropTypes.func,
  updateTask: PropTypes.func
}

const mapStateToProps = state => {
  return {
    show: state.modal.showModal,
    id: state.modal.idToUpdate,
    taskToUpdate: state.tasks.taskToUpdate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createTask: task => dispatch(createTask(task)),
    hideModal: () => dispatch(hideModalAction()),
    getTaskToUpdate: (id) => dispatch(getTask(id)),
    removeTaskToUpdate: () => dispatch(removeTaskToUpdate()),
    update: (task) => dispatch(updateTask(task))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTask)
