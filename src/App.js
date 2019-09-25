import React from 'react'
import './App.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './components/Header'
import Task from './components/Task'
import AddTask from './components/AddTask'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { listTasks } from './store/actions/crudTask'
import { activeTask, deactiveTask, reorder } from './store/actions/activeTasks'

library.add(faCheck, faPlay, faPause, faRedo)

class App extends React.Component {

  componentDidMount () {
    this.props.listTasks()
  }

  onDragEnd = (result) => {
    const { draggableId, source, destination } = result
    const task = this.props[source.droppableId].filter(x => x.id === draggableId)[0]


    if (!destination || task.running || ( source.index === destination.index &&
        source.droppableId === destination.droppableId)
    ) {
      return
    }

    this.props.reorder(task.id, source.index, destination.index, source.droppableId, destination.droppableId)
  };

  render () {
    return (
      <div>
        <Header />
        <AddTask />

        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId='activeTasks'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className='container d-flex flex-wrap'
              >
                {
                  this.props.activeTasks.map((task, index) => (
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
                          className="p-3 col-12"
                        >
                          <Task task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <Droppable droppableId='tasks'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                className='container d-flex flex-wrap'
              >
                {
                  this.props.tasks.map((task, index) => (
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
                          className="p-3 col-12"
                        >
                          <Task task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))
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

App.propTypes = {
  listTasks: PropTypes.func.isRequired,
  deactiveTask: PropTypes.func.isRequired,
  activeTask: PropTypes.func.isRequired,
  reorder: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  // console.log('state', {active: state.activeTasks, incative: state.tasks})
  return {
    tasks: state.tasks.data,
    activeTasks: state.activeTasks.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: () => dispatch(listTasks()),
    deactiveTask: (id) => dispatch(deactiveTask(id)),
    activeTask: (id) => dispatch(activeTask(id)),
    reorder: (id, prevIndex, nextIndex, from, to) => dispatch(reorder(id, prevIndex, nextIndex, from, to))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
