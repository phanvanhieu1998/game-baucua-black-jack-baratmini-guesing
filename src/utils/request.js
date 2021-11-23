import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

const site_url = process.env.VUE_APP_SITE_URL;

// create an axios instance
const service = axios.create({
  baseURL: site_url+'/ajax.php', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 0 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.errors) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },

  error => {
    let type = error.response.status === 400? 'warning': 'error'
    let message = error.response.data.message

    if(!message){
      message = error.message
    }

    Message({
      message: message,
      type: type,
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
