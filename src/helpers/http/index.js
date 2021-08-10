import axios from 'axios'
import env from '../../env'

export default axios.create({
  baseURL: env.baseURL,
  withCredentials: true
  // headers: {
  //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //   'Content-Type': 'application/json'
  // }
})
