// export const addToHistory = (history) => (
//   return (dispatch, getState, { getFirestore }) => {

//   }
// )

export const addToHistory = (history) => {
  return (dispatch, getState, { getFirestore }) => {
    console.log(history)
    getFirestore()
      .collection('task_history')
      .add(history)
      .then(() => { })
  }
}
