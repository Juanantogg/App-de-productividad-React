import { updateTask } from './crudTask'
import { addToHistory } from './taskHistory'

// Setear tarea activa
export const setActiveTasks = (tasks) => {
  return {
    type: 'SET_ACTIVE_TASKS',
    payload: tasks
  }
}

// Activar una tarea
export const activeTask = (id) => {
  return (dispatch, getState) => {
    const tasks = getState().tasks.data
    const index = tasks.findIndex(x => x.id === id)
    const activeTask = tasks.splice(index, 1)[0]
    const activeTasks = getState().activeTasks.data
    activeTask.active = true
    activeTasks.push(activeTask)

    // Quitar tarea activa de las tareas inactivas
    dispatch({ type: 'LIST_TASKS', data: tasks })
    // Agregar tarea como activa
    dispatch({ type: 'SET_ACTIVE_TASK', data: activeTasks })

    // Actualizar tarea en DB
    dispatch(updateTask({
      ...activeTask,
      created: activeTask.created instanceof Date ? activeTask.created : activeTask.created.toDate(),
      updated: !activeTask.updated ? new Date() : activeTask.updated instanceof Date ? activeTask.updated : activeTask.updated.toDate()
    }))
  }
}

// Desactivar una tarea
export const deactiveTask = (id) => {
  return (dispatch, getState) => {
    const activeTasks = getState().activeTasks.data
    const index = activeTasks.findIndex(x => x.id === id)
    const task = activeTasks.splice(index, 1)[0]
    const tasks = getState().tasks.data
    task.active = false
    task.completed = false
    tasks.push(task)

    // Agregar tarea inactiva a las tareas inactivas
    dispatch({ type: 'LIST_TASKS', data: tasks })
    // Eliminar tarea activa
    dispatch({ type: 'SET_ACTIVE_TASK', data: activeTasks })

    // Actualizar tarea en DB
    dispatch(updateTask({
      ...task,
      created: task.created instanceof Date ? task.created : task.created.toDate(),
      updated: !task.updated ? new Date() : task.updated instanceof Date ? task.updated : task.updated.toDate()
    }))
  }
}

export const completeTask = (data) => {
  return (dispatch, getState, { getFirestore }) => {
    const activeTasks = getState().activeTasks.data
    const index = activeTasks.findIndex(x => x.id === data.task.id)
    activeTasks[index] = data.task
    dispatch({ type: 'SET_ACTIVE_TASK', data: activeTasks })
    dispatch(updateTask({ ...data.task }))
    dispatch(addToHistory(data.history))
  }
}

export const setIsRunningTasks = (task) => {
  return (dispatch, getState) => {
    let tasks = getState().activeTasks.data
    let running = null
    let stopped = null

    const index = tasks.findIndex(x => x.id === task.id)

    tasks.splice(index, 1)
    running = tasks.filter(x => x.running)
    stopped = tasks.filter(x => !x.running)
    task.running ? running.unshift(task) : stopped.unshift(task)
    tasks = running.concat(stopped)

    updateTasks(dispatch, tasks)

    dispatch({ type: 'SET_IS_RUNNING_TASKS', data: tasks })
  }
}

const updateTasks = (dispatch, tasks) => {
  if (tasks.length) {
    let count = 0
    const interval = setInterval(() => {
      dispatch(
        updateTask({
          ...tasks[count],
          order: count + 1
        })
      )

      count++

      if (count > tasks.length - 1) {
        clearInterval(interval)
      }
    }, 200)
  }
}

export const reorder = (id, prevIndex, nextIndex, fromContainer, toContainer) => {
  return (dispatch, getState) => {
    let running = null
    let stopped = null
    let tasks = [...getState()[fromContainer].data]
    const task = tasks.splice(prevIndex, 1)[0]

    if (fromContainer === toContainer) {
      if (fromContainer === 'tasks') {
        tasks.splice(nextIndex, 0, task)
        dispatch({ type: 'LIST_TASKS', data: tasks })
      }

      if (fromContainer === 'activeTasks') {
        running = tasks.filter(x => x.running)
        stopped = tasks.filter(x => !x.running)
        nextIndex < running.length && running.push(task)
        if (nextIndex >= running.length) {
          nextIndex -= running.length
          stopped.splice(nextIndex, 0, task)
        }
        tasks = running.concat(stopped)
        dispatch({ type: 'SET_ACTIVE_TASKS', data: tasks })
      }
      updateTasks(dispatch, tasks)
    } else {
      fromContainer === 'tasks' && dispatch({ type: 'LIST_TASKS', data: tasks })
      fromContainer === 'activeTasks' && dispatch({ type: 'SET_ACTIVE_TASKS', data: tasks })
      updateTasks(dispatch, tasks)
      tasks = [...getState()[toContainer].data]

      if (toContainer === 'tasks') {
        task.active = false
        task.completed = false
        tasks.splice(nextIndex, 0, task)
        dispatch({ type: 'LIST_TASKS', data: tasks })
      }

      if (toContainer === 'activeTasks') {
        task.active = true
        running = tasks.filter(x => x.running)
        stopped = tasks.filter(x => !x.running)
        nextIndex < running.length && running.push(task)
        if (nextIndex >= running.length) {
          nextIndex -= running.length
          stopped.splice(nextIndex, 0, task)
        }
        tasks = running.concat(stopped)
        dispatch({ type: 'SET_ACTIVE_TASKS', data: tasks })
      }
      updateTasks(dispatch, tasks)
    }
  }
}
