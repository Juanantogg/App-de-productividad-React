import React from 'react'
import './App.css'
import { connect } from 'react-redux'
import Header from './components/Header'
import Task from './components/Task'
import AddTask from './components/AddTask'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons'

import { listTasks } from './store/actions/crudTask'

library.add(faCheck, faPlay, faPause, faRedo)

class App extends React.Component {
  componentDidMount () {
    this.props.listTasks()
  }

  render () {
    return (
      <div>
        <Header />
        <AddTask />
        <div className='container d-flex flex-wrap'>
          {
            this.props.activeTasks.map(task => (
              <Task
                key={task.id}
                task={task}
              />
            ))
          }
          {
            this.props.tasks.map(task => (
              <Task
                key={task.id}
                task={task}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  // console.log('state', { ...state.activeTasks.data })
  return {
    tasks: state.tasks.data,
    activeTasks: state.activeTasks.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: () => dispatch(listTasks())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
