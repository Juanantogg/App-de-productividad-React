const activeTasks = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TASKS':
      return {
        ...state,
        data: action.data
      }

    case 'COMPLETE_TASK':
      return {
        ...state,
        data: action.data
      }

    default:
      return state
  }
}

export default activeTasks
