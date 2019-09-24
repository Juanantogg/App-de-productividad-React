const toggleModal = (state = { showModal: false, idToUpdate: null }, action) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        ...state,
        showModal: true
      }

    case 'HIDE_MODAL':
      return {
        ...state,
        showModal: false,
        idToUpdate: null
      }

    case 'EDIT_TASK_MODAL':
      return {
        ...state,
        showModal: true,
        idToUpdate: action.payload
      }

    case 'HAS_TASK_TO_UPDATE':
      return {
        ...state,
        idToUpdate: null
      }

    default:
      return state
  }
}

export default toggleModal
