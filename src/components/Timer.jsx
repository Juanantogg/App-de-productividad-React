// import React, { useState, useEffect, useCallback, useRef } from 'react'

// function useInterval (callback, delay) {
//   const savedCallback = useRef()

//   // Remember the latest callback.
//   useEffect(() => {
//     savedCallback.current = callback
//   }, [callback])

//   // Set up the interval.
//   useEffect(() => {
//     function tick () {
//       savedCallback.current()
//     }
//     if (delay !== null) {
//       const id = setInterval(tick, delay)
//       return () => clearInterval(id)
//     }
//   }, [delay])
// }

// const Timer = ({ duration, runing, active }) => {
//   const [hours, setHours] = useState(0)
//   const [minutes, setMinutes] = useState(0)
//   const [seconds, setSeconds] = useState(0)
//   const [runingInter, setRuningInter] = useState(false)
//   console.log('head', seconds)

//   useEffect(() => {
//     const [h, m, s] = duration.split(':')
//     setHours(Number(h))
//     setMinutes(Number(m))
//     setSeconds(Number(s))
//   }, [duration])

//   // if (!active && `${hours}:${minutes}:${seconds}` !== duration) {
//   //   setHours(duration.split(':')[0])
//   //   setMinutes(duration.split(':')[1])
//   //   setSeconds(duration.split(':')[2])
//   // }

//   const downSec = () => {
//     setTimeout(() => {
//       const newSec = seconds - 1
//       setSeconds(newSec)
//       console.log(seconds)
//       downSec()
//     }, 1000)
//   }

//   useInterval(() => {
//     setSeconds(seconds - 1)
//   }, 1000)

//   const runTimer = useCallback(() => {
//     const interval = setInterval(() => {
//       setSeconds(seconds - 1)
//       // if (seconds > 0) {
//       //   console.log(seconds)
//       // }
//       // if (hours > 0) {
//       //   if (seconds > 0) {
//       //     setSeconds(seconds - 1)
//       //   } else {
//       //     if (minutes > 0) {
//       //       setMinutes(minutes - 1)
//       //       setSeconds(59)
//       //     }
//       //     if (minutes === 0) {
//       //       setMinutes(59)
//       //       setHours(hours - 1)
//       //     }
//       //     if (seconds === 0) {
//       //       setSeconds(59)
//       //     }
//       //   }
//       // } else {
//       //   console.log('hora < 0')
//       //   if (seconds > 0) {
//       //     setSeconds(seconds - 1)
//       //   } else {
//       //     if (minutes > 0) {
//       //       setMinutes(minutes - 1)
//       //       setSeconds(59)
//       //     } else {
//       //       clearInterval(interval)
//       //     }
//       //   }
//       // }
//       console.log(`${
//           hours.toString().length < 2 ? `0${hours}` : hours
//         }:${
//           minutes.toString().length < 2 ? `0${minutes}` : minutes
//         }:${
//           seconds.toString().length < 2 ? `0${seconds}` : seconds
//         }`)
//     }, 1000)
//   }, [hours, minutes, seconds])

//   useEffect(() => {
//     if (runingInter === false && runing === true) {
//       // runTimer()
//       downSec()
//       setRuningInter(true)
//     }
//   }, [runingInter, runing, runTimer, downSec])

//   return (
//     active
//       ? (
//         <span>{`${
//           hours.toString().length < 2 ? `0${hours}` : hours
//         }:${
//           minutes.toString().length < 2 ? `0${minutes}` : minutes
//         }:${
//           seconds.toString().length < 2 ? `0${seconds}` : seconds
//         }`}
//         </span>
//       )
//       : (
//         <small>{`${
//           hours.toString().length < 2 ? `0${hours}` : hours
//         }:${
//           minutes.toString().length < 2 ? `0${minutes}` : minutes
//         }:${
//           seconds.toString().length < 2 ? `0${seconds}` : seconds
//         }`}
//         </small>
//       )
//   )
// }

// class Timer extends React.Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       hours: this.props.duration.split(':')[0],
//       minutes: this.props.duration.split(':')[1],
//       seconds: this.props.duration.split(':')[2],
//       runing: this.props.runing,
//       active: this.props.active
//     }
//   }

//   componentDidMount () {
//     if (this.props.runing) {
//       this.runTimer()
//     }
//   }

//   shouldComponentUpdate (nextProps, nextState) {
//     if (nextProps.duration !== this.props.duration ||
//       nextProps.runing !== this.props.runing ||
//       nextProps.active !== this.props.active) {
//       return true
//     } else {
//       return false
//     }
//   }

//   componentDidUpdate (oldProps) {
//     const newProps = this.props

//     console.log('oldProps', oldProps)
//     console.log('nextProps', newProps)

//     this.setState(() => ({
//       hours: newProps.duration.split(':')[0],
//       minutes: newProps.duration.split(':')[1],
//       seconds: newProps.duration.split(':')[2],
//       runing: newProps.runing,
//       active: newProps.active
//     }))

//     console.log('this.state', this.state)
//   }

//   runTimer () {
//     const interval = setInterval(() => {
//       if (this.state.hours > 0) {
//         if (this.state.seconds > 0) {
//           this.setSectionTime('seconds', this.state.seconds - 1)
//         } else {
//           if (this.state.minutes > 0) {
//             this.setSectionTime('minutes', this.state.minutes - 1)
//             this.setSectionTime('seconds', '59')
//           }
//           if (this.state.minutes === '00') {
//             this.setSectionTime('minutes', '59')
//             this.setSectionTime('hours', this.state.hours - 1)
//           }
//           if (this.state.seconds === '00') {
//             this.setSectionTime('seconds', '59')
//           }
//         }
//       } else {
//         if (this.state.seconds > 0) {
//           this.setSectionTime('seconds', this.state.seconds - 1)
//         } else {
//           if (this.state.minutes > 0) {
//             this.setSectionTime('minutes', this.state.minutes - 1)
//             this.setSectionTime('seconds', '59')
//           } else {
//             clearInterval(interval)
//           }
//         }
//       }
//     }, 1000)
//   }

//   setSectionTime (section, time) {
//     this.setState({
//       [section]: time.toString().length < 2 ? `0${time}` : time
//     })
//   }

//   render () {
//     return (
//       this.state.active
//         ? <span>{`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}</span>
//         : <small>{`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}</small>
//     )
//   }
// }

// Timer.propTypes = {

// }

// export default Timer
