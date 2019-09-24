import { updateTask } from './crudTask'

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

export const completeTask = (task) => {
  return (dispatch, getState, { getFirestore }) => {
    console.log(task)
    getFirestore()
      .collection('tasks')
      .doc(task.id)
      .update(task)
      .then(() => {
        const activeTasks = getState().activeTasks.data
        const index = activeTasks.findIndex(x => x.id === task.id)
        activeTasks[index] = task
        dispatch({ type: 'SET_ACTIVE_TASK', data: activeTasks })
      })
  }
}
