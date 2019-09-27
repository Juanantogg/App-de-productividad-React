import React from 'react'
import './App.css'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './components/Header'
import AddTask from './components/AddTask'
import Tasks from './containers/Tasks'
import TaskHistory from './components/TaskHistory'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faPlay, faPause, faRedo } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { listTasks } from './store/actions/crudTask'
import { getHistory } from './store/actions/taskHistory'

library.add(faCheck, faPlay, faPause, faRedo)

class App extends React.Component {
  componentDidMount () {
    this.props.listTasks()
    this.props.getHistory()
  }

  render () {
    return (
      <div className='mt-5 pt-3'>
        <Router>
          <Header />
          <AddTask />
          <div className='pl-2 pr-2'>
            <Switch>
              <Route exact path='/tasks' component={Tasks} />
              <Route exact path='/history' component={TaskHistory} />
              <Redirect from='**' to='/tasks' />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

App.propTypes = {
  listTasks: PropTypes.func.isRequired,
  getHistory: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks.data,
    activeTasks: state.activeTasks.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    listTasks: () => dispatch(listTasks()),
    getHistory: () => dispatch(getHistory())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
