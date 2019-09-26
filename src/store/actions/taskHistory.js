export const addToHistory = (history) => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .collection('task_history')
      .add(history)
      .then(() => { })
  }
}

export const getHistory = () => {
  return (dispatch, getState, { getFirestore }) => {
    getFirestore()
      .get({ collection: 'task_history', orderBy: 'date' })
      .then((list) => {
        const history = []
        list.docs.forEach((doc) => history.push(doc.data()))
        dispatch({ type: 'SET_TASK_HISTORY', data: history })
      })
  }
}
