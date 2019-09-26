const taskHistory = (state = { data: [] }, action) => {
  switch (action.type) {
    case 'SET_TASK_HISTORY':
      return {
        ...state,
        data: action.data
      }

    default:
      return state
  }
}

export default taskHistory
