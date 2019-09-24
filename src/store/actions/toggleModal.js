// Mostar modal para añadir nueva tarea
export const showModalAction = () => ({
  type: 'SHOW_MODAL',
  payload: true
})

// Ocultar modal
export const hideModalAction = () => ({
  type: 'HIDE_MODAL',
  payload: false
})

// Mostar modal para editar una tarea existente
export const editTaskModal = (id) => ({
  type: 'EDIT_TASK_MODAL',
  payload: id
})
