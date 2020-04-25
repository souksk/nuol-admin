import * as _ from 'lodash'

// custom import
import {USER_KEY} from '../consts'

// get user data from localStorage
export const getUserDataFromLCStorage = () => {
  const user = JSON.parse(localStorage.getItem(USER_KEY))
  return user
}

// store user data to localStorage
export const storeUserDataToLCStorage = data => {
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const useAuth = () => {
  const userData = getUserDataFromLCStorage()

  //  check if user login or not
  const isAuthenticated = !_.isEmpty(userData)
  return isAuthenticated
}
