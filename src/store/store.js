import { createStore, applyMiddleware, compose } from 'redux'
import { reduxFirestore, getFirestore } from 'redux-firestore'
import thunk from 'redux-thunk'
import firebase from 'firebase/app'
import 'firebase/firestore'
import rootReducer from './reducers/rootReducer'
import firebaseConfig from '../firebaseConfig'

firebase.initializeApp(firebaseConfig)

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk.withExtraArgument({ getFirestore })),
  reduxFirestore(firebase, firebaseConfig)
))

export default store
