import uuid from 'uuid'

// Crear tarea en DB
export const createTask = task => {
  return (dispatch, getState, { getFirestore }) => {
    task.id = uuid()

    getFirestore()
      .set(
        { collection: 'tasks', doc: task.id },
        { ...task }
      ).then(() => {
        const data = getState().tasks.data.concat([task])

        dispatch({ type: 'CREATE_TASK', data })
        dispatch({ type: 'HIDE_MODAL' })
      }).catch((err) => {
        dispatch({ type: 'CREATE_TASK_ERROR', err })
      })
  }
}

// Eliminar tarea en DB
export const deleteTask = id => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .collection('tasks')
      .doc(id)
      .delete()
      .then(() => {
        const data = [...getState().tasks.data]
        const index = data.findIndex(x => x.id === id)
        data.splice(index, 1)
        dispatch({ type: 'UPDATE_TASKS', data })
      })
  }
}

// Actualizar tarea existente en DB
export const updateTask = (task) => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .collection('tasks')
      .doc(task.id)
      .update(task)
      .then(() => {
        const data = task.active ? [...getState().activeTasks.data] : [...getState().tasks.data]
        const index = data.findIndex(x => x.id === task.id)

        data[index] = task

        task.active ? dispatch({ type: 'SET_ACTIVE_TASKS', data }) : dispatch({ type: 'UPDATED_TASK', data })
        getState().modal.showModal && dispatch({ type: 'HIDE_MODAL' })
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// Obtener una tarea
export const getTask = taskID => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .collection('tasks')
      .doc(taskID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          dispatch({ type: 'HAS_TASK_TO_UPDATE' })
          dispatch({ type: 'UPDATE_TASK', data })
        } else {
          console.log('does not exist')
        }
      })
  }
}

// Obtener lista de tareas
export const listTasks = () => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .get({ collection: 'tasks', orderBy: 'order' })
      .then(res => {
        const active = []
        const inactive = []

        res.docs.forEach((doc) => {
          doc.data().active
            ? active.push(doc.data())
            : inactive.push(doc.data())
        })

        active.forEach(x => { x.running = false })

        dispatch({ type: 'SET_ACTIVE_TASKS', data: active })
        dispatch({ type: 'LIST_TASKS', data: inactive })
      })
  }
}

// Eliminar tarea marcada para actualizar del estado local
export const removeTaskToUpdate = () => ({ type: 'REMOVE_TAST_TO_UPDATE' })

export const addToHistory = data => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .set(
        { collection: 'tasks' },
        { ...data }
      ).then(res => {
      })
  }
}
