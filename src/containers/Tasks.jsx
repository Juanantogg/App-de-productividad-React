import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Task from './Task'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { activeTask, deactiveTask, reorder } from '../store/actions/activeTasks'

class Tasks extends React.Component {
  onDragEnd (result) {
    const { draggableId, source, destination } = result
    const task = this.props[source.droppableId].filter(x => x.id === draggableId)[0]

    if (!destination || task.running || (source.index === destination.index &&
      source.droppableId === destination.droppableId)
    ) {
      return
    }

    this.props.reorder(task.id, source.index, destination.index, source.droppableId, destination.droppableId)
  };

  render () {
    return (
      <div>
        <DragDropContext onDragEnd={(e) => this.onDragEnd(e)}>
          <Droppable droppableId='activeTasks'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className='container active-task p-0 mt-2 mb-2 rounded-lg d-flex flex-wrap justify-content-center align-items-center'
              >
                {
                  this.props.activeTasks &&
                    this.props.activeTasks.length
                    ? this.props.activeTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >

                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            key={task.id}
                            className='p-3 col-12'
                          >
                            <Task task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))
                    : (
                      <div className='flex-wrap justify-content-center align-items-center'>
                        <h3 className='text-center m-0'>Aún no tienes tareas activas</h3>
                        <p className='text-center m-0'>Puedes arrastar una tarea aquí</p>
                      </div>
                    )
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId='tasks'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className='container inactive-task p-0 mt-2 mb-2 rounded-lg d-flex flex-wrap justify-content-center align-items-center'
              >
                {
                  this.props.tasks &&
                    this.props.tasks.length
                    ? this.props.tasks.map((task, index) => (
                      <Draggable
                        className='w-100 h-100'
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            key={task.id}
                            className='p-3 col-12'
                          >
                            <Task task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))
                    : (
                      <div className='flex-wrap justify-content-center align-items-center'>
                        <h3 className='text-center m-0'>Aún no tienes tareas activas</h3>
                        <p className='text-center m-0'>Puedes arrastar una tarea aquí</p>
                      </div>
                    )
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }
}

Tasks.propTypes = {
  deactiveTask: PropTypes.func.isRequired,
  activeTask: PropTypes.func.isRequired,
  reorder: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks.data,
    activeTasks: state.activeTasks.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deactiveTask: (id) => dispatch(deactiveTask(id)),
    activeTask: (id) => dispatch(activeTask(id)),
    reorder: (id, prevIndex, nextIndex, from, to) => dispatch(reorder(id, prevIndex, nextIndex, from, to))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tasks)
