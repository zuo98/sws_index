import axios from 'axios'
axios.defaults.retry = 3
axios.defaults.retryDelay = 2000

export default {
  install: (Vue, errorCapture) => {
    axios.defaults.headers.post['Content-Type'] = 'application/json;chartset=utf8'
    axios.defaults.headers.put['Content-Type'] = 'application/json;chartset=utf8'

    axios.interceptors.response.use(
      (res) => {
        if (res.status === 200) {
          return res.data
        } else if (errorCapture && typeof errorCapture === 'function') {
          return errorCapture(res)
        }
      },
      (err) => {
        let config = err.config
        if (!config || !config.retry || config.__retryCount >= config.retry) {
          return Promise.reject(err)
        }

        config.__retryCount = config.__retryCount || 0
        config.__retryCount++

        return new Promise((resolve) => {
          window.setTimeout(() => {
            resolve()
          }, config.retryDelay || 1)
        }).then(() => axios(config))
      }
    )
  }
}
