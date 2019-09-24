const crudTask = (state = { data: [], taskToUpdate: null }, action) => {
  const { data } = action

  switch (action.type) {
    case 'CREATE_TASK':
    case 'UPDATE_TASKS':
    case 'UPDATED_TASK':
    case 'LIST_TASKS':
      return {
        ...state,
        data
      }

    case 'UPDATE_TASK':
      return {
        ...state,
        taskToUpdate: data
      }

    case 'REMOVE_TAST_TO_UPDATE':
      return {
        ...state,
        taskToUpdate: null
      }

    default:
      return state
  }
}

export default crudTask
