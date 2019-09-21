import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Header from './components/Header'
import Task from './components/Task'
import AddTask from './components/AddTask'

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      show: true,
      tasks: [
        {
          id: 1,
          completed: true,
          name: 'tarea 1',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 2,
          completed: true,
          name: 'tarea 2',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 3,
          completed: false,
          name: 'tarea 3',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 4,
          completed: true,
          name: 'tarea 4',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 5,
          completed: false,
          name: 'tarea 5',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 6,
          completed: false,
          name: 'tarea 6',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 7,
          completed: true,
          name: 'tarea 7',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 8,
          completed: false,
          name: 'tarea 8',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 9,
          completed: true,
          name: 'tarea 9',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 10,
          completed: true,
          name: 'tarea 10',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        },
        {
          id: 11,
          completed: false,
          name: 'tarea 11',
          description: 'asdasd asdasd asdasd asdasd asd',
          time: '30:00',
          date: new Date()
        }
      ]
    }
    this.showModal = this.showModal.bind(this)
  }

  showModal () {
    this.setState((state) => ({
      show: !state.show
    }))
    // this.setState({
    //   show: !this.state.show
    // })
  }

  render () {
    return (
      <div className='App'>
        <AddTask
          show={this.state.show}
          showModal={this.showModal}
        />
        <Header
          showModal={this.showModal}
        />

        <div className='container d-flex flex-wrap'>
          {
            this.state.tasks.map(task => (
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

export default App
