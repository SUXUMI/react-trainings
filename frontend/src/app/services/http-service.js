import axios from 'axios'
import {app} from '../config'

const axiosInstance = axios.create({
  baseURL: app.serviceBaseURL,
  // grabbed on the first page load only
  // headers: {
  //   token: getToken()
  // }
  // https://stackoverflow.com/a/43052288/1565790
})

export default axiosInstance
