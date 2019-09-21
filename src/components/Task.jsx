import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button } from 'react-bootstrap'

const Task = ({ task }) => {
  return (
    <div className='p-3 col-12 col-lg-6'>
      <Card>
        <Card.Body>
          <Card.Title className='d-flex justify-content-between'>
            <p> {task.name} </p>
            <small> {'time'} </small>
          </Card.Title>
          <Card.Text>{task.description}</Card.Text>
        </Card.Body>
        <Card.Footer className='d-flex justify-content-around'>
          <Button variant='success'>
            Completar
          </Button>
          <Button variant='primary'>
            Editar
          </Button>
          <Button variant='danger'>
            Eliminar
          </Button>
        </Card.Footer>
      </Card>
    </div>
  )
}

Task.propTypes = {
  task: PropTypes.object.isRequired
}

export default Task
