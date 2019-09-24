import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Button, ButtonToolbar, Dropdown, SplitButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteTask } from '../store/actions/crudTask'
import { activeTask, deactiveTask, completeTask, setIsRunningTasks } from '../store/actions/activeTasks'
import { editTaskModal } from '../store/actions/toggleModal'

class Task extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      task: props.task,
      hours: props.task.duration.split(':')[0],
      minutes: props.task.duration.split(':')[1],
      seconds: props.task.duration.split(':')[2]
    }
    this.runningTimer = false
    this.styleContainer = this.state.task.active ? 'p-0 mt-3 mb-3 col-12 bg-dark shadow' : 'p-3 col-12 col-lg-6'
    this.styleCard = this.state.task.active && 'bg-dark text-light'
    this.timer = null
  }

  // shouldComponentUpdate (nextP) {
  //   if ((nextP.task.running !== this.props.task.running) || this.runningTimer) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  componentDidUpdate (prevP) {
    if (this.props.task.running && !this.runningTimer) {
      this.setState({
        task: { ...this.props.task }
      })
      this.runningTimer = true
      this.startTimer()
    }

    if (!this.props.task.running && this.runningTimer) {
      this.setState({
        task: { ...this.props.task }
      })
      this.runningTimer = false
      clearInterval(this.timer)
    }
  }

  restartTask () {
    this.setState({
      hours: this.state.task.duration.split(':')[0],
      minutes: this.state.task.duration.split(':')[1],
      seconds: this.state.task.duration.split(':')[2]
    })
  }

  setComplited () {
    const task = {
      ...this.state.task,
      created: this.state.task.created instanceof Date
        ? this.state.task.created
        : this.state.task.created.toDate()
    }

    task.updated &&
      (
        task.updated = this.state.task.updated instanceof Date
          ? this.state.task.updated
          : this.state.task.updated.toDate()
      )
    this.setIsRunning()
    this.setState({
      task: {
        ...task,
        running: false
      }
    })

    if (task.history && task.history.length) {
      task.history.unshift({
        date: new Date(),
        time: this.setExecutionTime()
      })
    } else {
      task.history = [{
        date: new Date(),
        time: this.setExecutionTime()
      }]
    }
    this.props.completeTask(task)
  }

  setExecutionTime () {
    let [startHours, startMinutes, startSeconds] = this.state.task.duration.split(':')
    let [countHours, countMinutes, countSeconds] = [0, 0, 0]

    const endHours = Number(this.state.hours)
    const endMinutes = Number(this.state.minutes)
    const endSeconds = Number(this.state.seconds)

    startHours = Number(startHours)
    startMinutes === '00' ? startMinutes = 60 : Number(startMinutes)
    startSeconds === '00' ? startSeconds = 60 : Number(startSeconds)

    countSeconds = startSeconds - endSeconds
    startSeconds === 60 && startMinutes--
    countMinutes = startMinutes - endMinutes
    startMinutes === 60 && startHours--
    countHours = startHours - endHours

    if (countSeconds === 60) {
      countSeconds = 0
      countMinutes++
    }

    if (countMinutes === 60) {
      countMinutes = 0
      countHours++
    }

    return `${
      countHours.toString().length < 2 ? `0${countHours}` : `${countHours}`
    }:${
      countMinutes.toString().length < 2 ? `0${countMinutes}` : `${countMinutes}`
    }:${
      countSeconds.toString().length < 2 ? `0${countSeconds}` : `${countSeconds}`
    }`
  }

  setIsRunning () {
    const task = { ...this.state.task }
    task.running = !this.state.task.running
    this.props.setRunningInStore(task)
  }

  setSectionTime (section, time) {
    this.setState({
      [section]: time.toString().length < 2 ? `0${time}` : time
    })
  }

  startTimer () {
    this.timer = setInterval(() => {
      if (this.state.hours > 0) {
        if (this.state.seconds > 0) {
          this.setSectionTime('seconds', this.state.seconds - 1)
        } else {
          if (this.state.minutes > 0) {
            this.setSectionTime('minutes', this.state.minutes - 1)
            this.setSectionTime('seconds', '59')
          }
          if (this.state.minutes === '00') {
            this.setSectionTime('minutes', '59')
            this.setSectionTime('hours', this.state.hours - 1)
          }
          if (this.state.seconds === '00') {
            this.setSectionTime('seconds', '59')
          }
        }
      } else {
        if (this.state.seconds > 0) {
          this.setSectionTime('seconds', this.state.seconds - 1)
        } else {
          if (this.state.minutes > 0) {
            this.setSectionTime('minutes', this.state.minutes - 1)
            this.setSectionTime('seconds', '59')
          } else {
            clearInterval(this.timer)
            this.setComplited()
          }
        }
      }
      // console.log(`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`)
    }, 1000)
  }

  render () {
    return (
      <div className={this.styleContainer}>
        <Card className={this.styleCard}>
          <Card.Body>
            <Card.Title className='m-0 d-flex flex-wrap justify-content-between align-items-start'>
              <div className='col-12 col-md-5 d-flex flex-column text-center'>
                <h2 className='mb-1'>{this.state.task.name}</h2>
                {
                  (
                    this.state.task.running ||
                    this.state.task.duration !== `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`
                  )
                    ? <small style={{ fontSize: '12px' }}>{this.state.task.duration}</small>
                    : <small style={{ fontSize: '12px' }}>&nbsp;</small>
                }
              </div>

              {this.state.task.active && (
                <ButtonToolbar className='p-0 mt-2 mb-3 w-50 col-7 col-md-4 d-flex justify-content-around'>
                  {/* Marcar tarea como completada */}
                  <Button
                    className='rounded-circle'
                    disabled={this.state.task.duration === `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}
                    onClick={() => this.setComplited()}
                    variant='outline-success'
                  >
                    <FontAwesomeIcon icon='check' />
                  </Button>

                  {/* Iniciar/pausar tarea */}
                  <Button variant='outline-primary' className='rounded-circle' onClick={() => this.setIsRunning()}>
                    {
                      this.state.task.running
                        ? <FontAwesomeIcon icon='pause' />
                        : <FontAwesomeIcon icon='play' />
                    }
                  </Button>

                  {/* Reiciar tarea */}
                  <Button
                    className='rounded-circle'
                    disabled={this.state.task.duration === `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}
                    onClick={() => this.restartTask()}
                    variant='outline-danger'
                  >
                    <FontAwesomeIcon icon='redo' />
                  </Button>
                </ButtonToolbar>
              )}

              <div className='mt-2 mb-3'>
                {
                  this.state.task.active
                    ? <h3 className='mt-2 mb-3'>{`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}</h3>
                    : <small>{`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}</small>
                }
                {
                  this.state.task.history && this.state.task.history.length &&
                    <ButtonToolbar>
                      <SplitButton
                        drop='left'
                        variant={this.state.task.active ? 'dark' : 'light'}
                        title='Historial'
                      >
                        {
                          this.state.task.history.map((h, i) => (
                            <Dropdown.Item className='text-center' key={i}>{h.time}</Dropdown.Item>
                          ))
                        }
                      </SplitButton>
                    </ButtonToolbar>
                }
              </div>
            </Card.Title>

            <Card.Text>{this.state.task.description}</Card.Text>
          </Card.Body>

          <Card.Footer className='d-flex justify-content-around'>
            {
              this.state.task.active
                ? (
              // Iniciar tarea
                  <Button
                    disabled={this.state.task.duration !== `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}
                    onClick={() => this.props.deactiveTaskInStore(this.state.task.id)}
                    variant='success'
                  >
                    Desactivar
                  </Button>
                )
                : (
              // Iniciar tarea
                  <Button
                    onClick={() => this.props.activeTaskInStore(this.state.task.id)}
                    variant='success'
                  >
                    Activar
                  </Button>
                )
            }

            {/* Editar tarea */}
            <Button
              disabled={this.state.task.active}
              onClick={() => this.props.editTask(this.state.task.id)}
              variant='primary'
            >
              Editar
            </Button>

            {/* Eliminar tarea */}
            <Button
              disabled={this.state.task.active}
              onClick={() => deleteTask(this.state.task.id)}
              variant='danger'
            >
              Eliminar
            </Button>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  activeTaskInStore: PropTypes.func.isRequired,
  deactiveTaskInStore: PropTypes.func.isRequired,
  completeTask: PropTypes.func.isRequired,
  setRunningInStore: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
  return {
    deleteTask: (id) => dispatch(deleteTask(id)),
    editTask: (id) => dispatch(editTaskModal(id)),
    activeTaskInStore: (id) => dispatch(activeTask(id)),
    deactiveTaskInStore: (id) => dispatch(deactiveTask(id)),
    completeTask: (task) => dispatch(completeTask(task)),
    setRunningInStore: (task) => dispatch(setIsRunningTasks(task))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Task)
