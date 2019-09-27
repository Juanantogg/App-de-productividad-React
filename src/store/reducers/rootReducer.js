import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import crudTask from './crudTask'
import toggleModal from './toggleModal'
import activeTasks from './activeTasks'
import taskHistory from './taskHistory'
import filter from './filter'

const rootReducer = combineReducers({
  filter,
  taskHistory,
  activeTasks,
  modal: toggleModal,
  firestore: firestoreReducer,
  tasks: crudTask
})

export default rootReducer
