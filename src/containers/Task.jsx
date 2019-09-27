import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Button, ButtonToolbar, Dropdown, SplitButton } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteTask, updateTask } from '../store/actions/crudTask'
import { activeTask, deactiveTask, completeTask, setIsRunningTasks } from '../store/actions/activeTasks'
import { editTaskModal } from '../store/actions/toggleModal'
import firebase from 'firebase/app'
import 'firebase/firestore'

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
    this.timer = null
  }

  componentDidMount () {
    if (this.state.task.active) {
      const inStorage = JSON.parse(window.localStorage.getItem(`${this.state.task.id}`))
      if (inStorage) {
        window.localStorage.removeItem(`${this.state.task.id}`)
        this.setState({
          hours: inStorage.runningTime.split(':')[0],
          minutes: inStorage.runningTime.split(':')[1],
          seconds: inStorage.runningTime.split(':')[2]
        })
      }
    }
  }

  componentDidUpdate (prevP, prevS) {
    if (this.props.search !== prevP.search) {
      console.log(this.state.task.name.includes(this.props.search))
    }
    // Resetear temporizadir cuando la tarea esta completada
    if (!this.props.task.completed && this.state.task.completed) {
      this.resetState()
    }
    if (this.props.task.completed && !this.state.task.completed) {
      this.resetState()
    }

    // Actualizar tarea cuando se edita su información
    if (this.props.task.duration !== this.state.task.duration ||
      this.props.task.name !== this.state.task.name ||
      this.props.task.description !== this.state.task.description
    ) {
      this.resetState()
    }

    // Iniciar temporizador de la tarea
    if (this.props.task.running && !this.runningTimer) {
      this.setState({
        task: { ...this.props.task }
      })
      this.runningTimer = true
      this.startTimer()
    }

    // Pausar temporizador de la tarea
    if (!this.props.task.running && this.runningTimer) {
      this.setState({
        task: { ...this.props.task }
      })
      this.runningTimer = false
      clearInterval(this.timer)
    }
  }

  resetState () {
    this.setState({
      task: { ...this.props.task },
      hours: this.props.task.duration.split(':')[0],
      minutes: this.props.task.duration.split(':')[1],
      seconds: this.props.task.duration.split(':')[2]
    })
  }

  restartTask () {
    this.props.updateTask({
      ...this.state.task,
      completed: false
    })
  }

  setCompleted () {
    const finished = this.setExecutionTime()
    const task = {
      ...this.state.task,
      completed: true,
      running: false,
      created: this.state.task.created instanceof Date
        ? this.state.task.created
        : this.state.task.created.toDate()
    }
    const history = {
      taskName: this.state.task.name,
      taskTime: this.state.task.duration,
      finished,
      date: new Date(),
      task_id: firebase.firestore().collection('tasks').doc(this.state.task.id)
    }

    task.updated &&
      (
        task.updated = this.state.task.updated instanceof Date
          ? this.state.task.updated
          : this.state.task.updated.toDate()
      )
    this.setIsRunning()

    if (task.history && task.history.length) {
      task.history.unshift({
        date: new Date(),
        time: finished
      })
    } else {
      task.history = [{
        date: new Date(),
        time: finished
      }]
    }
    this.props.completeTask({ task, history })
  }

  setExecutionTime () {
    let [startHours, startMinutes, startSeconds] = this.state.task.duration.split(':')
    let [countHours, countMinutes, countSeconds] = [0, 0, 0]

    const endHours = Number(this.state.hours)
    const endMinutes = Number(this.state.minutes)
    const endSeconds = Number(this.state.seconds)

    startMinutes === '00' ? startMinutes = 60 : Number(startMinutes)
    startSeconds === '00' ? startSeconds = 60 : Number(startSeconds)
    startHours = Number(startHours)
    startMinutes = Number(startMinutes)
    startSeconds = Number(startSeconds)

    if (startSeconds < endSeconds) {
      startSeconds += 60
      startMinutes--
    }

    if (startMinutes < endMinutes) {
      startMinutes += 60
      startHours--
    }

    countSeconds = startSeconds - endSeconds
    startMinutes === 60 && startHours--
    startSeconds === 60 && startMinutes--
    countMinutes = startMinutes - endMinutes
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
            this.setCompleted()
          }
        }
      }
      // console.log(`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`)
    }, 1000)
  }

  filterByDuration () {
    const hours = Number(this.state.task.duration.split(':')[0])
    const minutes = Number(this.state.task.duration.split(':')[1])
    const seconds = Number(this.state.task.duration.split(':')[2])

    switch (this.props.filter) {
      case 'Menos de 30 min':
        return hours === 0 && minutes <= 30

      case 'De 30 min a 1 hr':
        return (hours === 0 && minutes >= 30 && minutes <= 59) ||
          (hours === 1 && minutes === 0 && seconds === 0)

      case 'Más de 1 hr':
        return (hours >= 1 && minutes >= 0 && minutes <= 59)

      default:
        return false
    }
  }

  render () {
    window.addEventListener('beforeunload', (e) => {
      if (this.state.task.duration !== `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`) {
        const task = {
          id: this.state.task.id,
          runningTime: `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`
        }
        window.localStorage.setItem(`${this.state.task.id}`, JSON.stringify(task))
      }
    })

    return (
      <>
        <Card className={
          this.state.task.active
            ? this.props.filter === 'Todas' || this.props.filter === 'Activas' || this.props.filter === ''
              ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
              : this.props.filter === 'Completadas' && this.state.task.completed
                ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                : this.props.filter === 'Pendientes' && !this.state.task.completed && (this.state.task.duration === `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`)
                  ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                  : this.props.filter === 'Ejecutandose' && this.state.task.running
                    ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                    : this.props.filter === 'Pausadas' && (this.state.task.duration !== `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`)
                      ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                      : this.props.filter === 'Menos de 30 min' && this.filterByDuration()
                        ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                        : this.props.filter === 'De 30 min a 1 hr' && this.filterByDuration()
                          ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                          : this.props.filter === 'Más de 1 hr' && this.filterByDuration()
                            ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                            : this.props.search && this.state.task.name.includes(this.props.search)
                              ? 'bg-dark text-light m-0 mr-3 mt-3 ml-3'
                              : 'd-none'
            : this.props.filter === 'Todas' || this.props.filter === 'Inactivas' || this.props.filter === ''
              ? 'text-dark m-0 mr-3 mt-3 ml-3'
              : this.props.filter === 'Menos de 30 min' && this.filterByDuration()
                ? 'text-dark m-0 mr-3 mt-3 ml-3'
                : this.props.filter === 'De 30 min a 1 hr' && this.filterByDuration()
                  ? 'text-dark m-0 mr-3 mt-3 ml-3'
                  : this.props.filter === 'Más de 1 hr' && this.filterByDuration()
                    ? 'text-dark m-0 mr-3 mt-3 ml-3'
                    : this.props.search && this.state.task.name.includes(this.props.search)
                      ? 'text-dark m-0 mr-3 mt-3 ml-3'
                      : 'd-none'
        }
        >
          <Card.Body>
            <Card.Title className='m-0 d-flex flex-wrap justify-content-between align-items-start'>
              <div className='col-12 col-md-5 d-flex flex-column text-center'>
                <h2 className='mb-1'>{this.state.task.name}</h2>
                {
                  (
                    this.state.task.running || this.state.task.completed ||
                    this.state.task.duration !== `${this.state.hours}:${this.state.minutes}:${this.state.seconds}`
                  ) &&
                    <small>{this.state.task.duration}</small>
                }
              </div>

              {this.state.task.active && (
                <ButtonToolbar className='p-0 mt-2 mb-3 w-50 col-7 col-md-4 d-flex justify-content-around'>
                  {/* Marcar tarea como completada */}
                  <Button
                    className='rounded-circle'
                    disabled={this.state.task.duration === `${this.state.hours}:${this.state.minutes}:${this.state.seconds}` || this.state.task.completed}
                    onClick={() => this.setCompleted()}
                    variant='outline-success'
                  >
                    <FontAwesomeIcon icon='check' />
                  </Button>

                  {/* Iniciar/pausar tarea */}
                  <Button
                    className='rounded-circle'
                    disabled={this.state.task.completed}
                    onClick={() => this.setIsRunning()}
                    variant='outline-primary'
                  >
                    {
                      this.state.task.running
                        ? <FontAwesomeIcon icon='pause' />
                        : <FontAwesomeIcon icon='play' />
                    }
                  </Button>

                  {/* Reiciar tarea */}
                  <Button
                    className='rounded-circle'
                    disabled={this.state.task.duration === `${this.state.hours}:${this.state.minutes}:${this.state.seconds}` && !this.state.task.completed}
                    onClick={() => this.restartTask()}
                    variant='outline-danger'
                  >
                    <FontAwesomeIcon icon='redo' />
                  </Button>
                </ButtonToolbar>
              )}

              <div className={this.state.task.active ? 'mt-2 mb-3' : 'mt-2 mb-3 w-100 text-center'}>
                {
                  this.state.task.completed && <small className='d-block text-center'>Completada en:</small>
                }
                {
                  this.state.task.running && <small className='d-block text-center'>En ejecución:</small>
                }
                {
                  !this.state.task.running &&
                    this.state.task.duration !== `${this.state.hours}:${this.state.minutes}:${this.state.seconds}` &&
                      <small className='d-block text-center'>En pausa:</small>
                }
                {
                  this.state.task.active
                    ? this.state.task.completed
                      ? this.state.task.history[0].time === this.state.task.duration
                        ? <h3 className='mb-2 mb-3 text-danger'>{this.state.task.history[0].time}</h3>
                        : <h3 className='mb-2 mb-3 text-success'>{this.state.task.history[0].time}</h3>
                      : <h3>{`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}</h3>
                    : <h5 className='d-block text.center'>{`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}</h5>
                }
                {
                  this.state.task.history && this.state.task.history.length &&
                    <ButtonToolbar className='d-flex justify-content-end'>
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
                    disabled={this.state.task.duration !== `${this.state.hours}:${this.state.minutes}:${this.state.seconds}` && !this.state.task.completed}
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
              onClick={() => this.props.deleteTask(this.state.task.id)}
              variant='danger'
            >
              Eliminar
            </Button>
          </Card.Footer>
        </Card>
      </>
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
  updateTask: PropTypes.func.isRequired,
  setRunningInStore: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  return {
    filter: state.filter.filter,
    search: state.filter.search
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteTask: (id) => dispatch(deleteTask(id)),
    editTask: (id) => dispatch(editTaskModal(id)),
    activeTaskInStore: (id) => dispatch(activeTask(id)),
    deactiveTaskInStore: (id) => dispatch(deactiveTask(id)),
    completeTask: (data) => dispatch(completeTask(data)),
    updateTask: (task) => dispatch(updateTask(task)),
    setRunningInStore: (task) => dispatch(setIsRunningTasks(task))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task)
