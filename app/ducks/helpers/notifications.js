import { NotificationManager } from 'react-notifications'

export function successNotification(subject, verb, color = 'success') {
  return x => {
    if (__CLIENT__) {
      NotificationManager[color](`${subject} ${verb} successfully.`)
    }
    return x
  }
}

export function genericNotification(msg, color = 'success') { 
  return x => {
    if (__CLIENT__) {
      NotificationManager[color](msg)
    }
    return x
  }
}

export function errorNotification(subject, verb, color = 'error') {
  return x => {
    if (__CLIENT__) {
      NotificationManager[color](`${subject} failed to ${verb}, check your submission and contact the admin if this message persists.`)
    }
    throw x
  }
}
