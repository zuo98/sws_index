import axios from 'axios'

export const useIndexType = () => {
  const indexType = [
    {
      value: '市场表征',
      key: 0
    },
    {
      value: '一级行业',
      key: 1,
      children: [
        {
          value: '二级行业',
          key: 10
        }
      ]
    },

    {
      value: '风格指数',
      key: 3
    },
    {
      value: '新三板',
      key: 4
    }
  ]

  const getIndexListByType = (type) => {
    return axios.get(`/sws/index_name/?indextype=${type}`)
  }

  const getIndexCurrentByType = (type) => {
    return axios.get(`/sws/index_publish/current/?page=1&page_size=200&indextype=${type}`)
  }

  const getAllIndex = async () => {
    const promiseAll = indexType.map(async (type) => {
      const index = await getIndexListByType(type.value).then(({ data }) => data || [])
      return { value: type.value, key: type.key, index: index }
    })
    const indexAll = await Promise.all(promiseAll).then((res) => res)
    return indexAll
  }

  return { getAllIndex, getIndexListByType, getIndexCurrentByType }
}
