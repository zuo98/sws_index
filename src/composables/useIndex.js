import axios from 'axios'

export const useIndex = (opts) => {
  const { indexCode } = opts
  console.log('indexCode: ', indexCode)

  /**
   * @description
   * @param {String} code -indexCode
   * @returns Promise
   */
  const getIndexCurrentData = (code = indexCode) => {
    return axios.get(`/sws/index_publish/details/index_spread/?swindexcode=${code}`)
  }

  /**
   * @description
   * @param {String} type -Type:DAY,WEEK,MONTH
   * @param {String} code -indexCode
   * @returns Promise
   */
  const getIndexTimelinesByType = (type, code = indexCode) => {
    return axios.get(`/sws/index_publish/trend/?swindexcode=${code}&period=${type}`)
  }

  /**
   * @description
   * @param {String} code -indexCode
   * @returns Promise
   */
  const getIndexTimelinesData = (code = indexCode) => {
    return axios.get(`/sws/index_publish/details/timelines/?swindexcode=${code}`)
  }

  return { getIndexCurrentData, getIndexTimelinesData, getIndexTimelinesByType }
}
