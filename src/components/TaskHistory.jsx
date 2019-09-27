import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { VictoryChart, VictoryGroup, VictoryBar, VictoryTheme } from 'victory'
import { Table } from 'react-bootstrap'

const TaskHistory = ({ history }) => {
  const date = new Date().getDate()
  const tasksForDate = []
  const tasksBefore = []
  const tasksAfter = []

  if (history.length > 0) {
    for (let i = date; i > date - 7; i--) {
      const oneDayHistory = history.filter(x => x.date.toDate().getDate() === i)
      if (oneDayHistory.length) {
        const beforeTime = oneDayHistory.filter(x => x.taskTime !== x.finished)
        const afterTime = oneDayHistory.filter(x => x.taskTime === x.finished)
        tasksForDate.push({ beforeTime, afterTime })
        tasksBefore.push({
          x: oneDayHistory[0].date.toDate().getDate(),
          y: beforeTime.length
        })

        tasksAfter.push({
          x: oneDayHistory[0].date.toDate().getDate(),
          y: afterTime.length
        })
      }
    }
    history.reverse()
  }

  const showDate = (date) => {
    let formedDate = date.toDate().getDate().toString().length < 2
      ? `0${date.toDate().getDate()}/`
      : `${date.toDate().getDate()}/`

    formedDate += date.toDate().getMonth().toString().length < 2
      ? `0${date.toDate().getMonth()}/`
      : `${date.toDate().getMonth()}/`

    formedDate += date.toDate().getFullYear().toString().length < 2
      ? `0${date.toDate().getFullYear()}`
      : `${date.toDate().getFullYear()}`

    return formedDate
  }

  return (
    <div className='container'>
      {
        history.length ? (
          <>
            <div>
              <h3 className='w-100 text-center pt-4'>Gráfica de los últimos {tasksBefore.length} días</h3>
              <div style={{ height: '500px' }}>
                <VictoryChart
                  scale={{ x: 'linear', y: 'linear' }}
                  theme={VictoryTheme.material}
                  domain={{
                    x: [tasksBefore.length
                      ? tasksBefore[0].x
                      : 0,
                    tasksBefore.length
                      ? tasksBefore[tasksBefore.length - 1].x
                      : tasksBefore.length]
                  }}
                >
                  <VictoryGroup
                    vertical
                    offset={19}
                    style={{ data: { width: 19 } }}
                    colorScale={['#218838', '#C82333']}
                  >
                    <VictoryBar
                      labels={({ datum }) => `T:${datum.y}`}
                      data={tasksBefore}
                    />
                    <VictoryBar
                      labels={({ datum }) => `T:${datum.y}`}
                      data={tasksAfter}
                    />
                  </VictoryGroup>
                </VictoryChart>
              </div>
            </div>

            <h3 className='w-100 text-center pt-4'>Historial de tareas</h3>
            <div>
              <Table className='text-center' striped bordered hover variant='dark' size='sm'>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Nombre de la tarea</th>
                    <th>Tiempo asignado a la tares</th>
                    <th>Tiempo de ejecución de la tarea</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    history.map((h, i) => (
                      <tr key={h.date.toDate().getTime()}>
                        <td>{showDate(h.date)}</td>
                        <td>{h.taskName}</td>
                        <td>{h.taskTime}</td>
                        <td>{h.finished}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </div>
          </>
        )
          : null
      }
    </div>
  )
}

TaskHistory.propTypes = {
  history: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    history: state.taskHistory.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskHistory)
