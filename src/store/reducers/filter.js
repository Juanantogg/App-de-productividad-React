const filter = (state = { filter: '', search: '' }, action) => {
  switch (action.type) {
    case 'SET_FILTER_TASKS':
      return {
        ...state,
        filter: action.payload
      }

      // case 'SET_SEARCH':
      //   return {
      //     ...state,
      //     search: action.payload
      //   }

    default:
      return state
  }
}

export default filter
