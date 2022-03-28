import {ACCESS_TOKEN_NAME} from '@configs/constants'
import axios from 'app/api'
import history from '../../browserHistory'
import jwtDecode from 'jwt-decode'

interface DecodedToken {
  exp: number;
  [key: string]: any;
}


class JwtService {

  public static init() {
    this.setInterceptors()
    this.handleAuthentication()
  }

  public static setInterceptors = () => {
    axios.interceptors.response.use(
      response => response,
      err => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            JwtService.setSession(null);
            window.location.pathname = '/login'
          }
          throw err;
        })
      }
    )
  }

  public static handleAuthentication = () => {
    const accessToken = JwtService.getAccessToken()

    if (!accessToken) { return }

    if (JwtService.isAuthTokenValid(accessToken)) {
      JwtService.setSession(accessToken)
    } else {
      JwtService.setSession(null)
    }
  }


  public static setSession = (accessToken: string | null) => {
    if (!!accessToken) {
      localStorage.setItem(ACCESS_TOKEN_NAME, accessToken)
      axios.defaults.headers.common.Authorization = String('Bearer ' + accessToken)
    } else {
      localStorage.removeItem(ACCESS_TOKEN_NAME)
      localStorage.removeItem('userInfo')
      delete axios.defaults.headers.common.Authorization
    }
  }

  public static logout = () => {
    JwtService.setSession(null)
  }

  public static isAuthTokenValid = (accessToken: string | null) => {
    if (!accessToken) {
      return false
    }
    const decoded: DecodedToken = jwtDecode(accessToken)

    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      console.warn('access token expired')
      return false
    } else {
      return true
    }
  }

  public static getAccessToken = () => {
    return window.localStorage.getItem(ACCESS_TOKEN_NAME)
  }

  public static getUserInfo = () => {
    return window.localStorage.getItem('userInfo')
  }

  public static setUserInfo = (data: string) => {
    return localStorage.setItem('userInfo', data)
  }

  public static decodeAccessToken = (): DecodedToken => {
    const token = JwtService.getAccessToken()
    return jwtDecode(token ? token : '')
  }
}

export default JwtService
