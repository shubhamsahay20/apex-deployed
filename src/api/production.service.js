import API from './api'

const addProduction = (token, data) => {
  return API.post(`/production/addProduct`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const getAllProduction = (token, page, limit, searchQuery = '') => {
  return API.get(
    `/production/?page=${page}&limit=${limit}&search=${searchQuery}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

const deleteProduction = (token, id) => {
  return API.delete(`/warehouses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const qrScan = async (token, data) => {
  try {
    const res = await API.post(`/production/qrscan`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return res
  } catch (error) {
    throw new Error('Error while geting qr scan')
  }
}

const byPassWithoutQr = async (token, data) => {
  try {
    const res = await API.post(`/stock/bypasstowarehouse`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return res.data
  } catch (error) {
    console.log('error is', error.response?.data.error)

    throw error
  }
}

const outOfDeliveryWithoutQr = async (token, data) => {
  try {
    const res = await API.post(`/stock/bypasstodelivery`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return res.data
  } catch (error) {
    throw new Error('Error while geting qr scan')
  }
}

export default {
  addProduction,
  getAllProduction,
  deleteProduction,
  qrScan,
  byPassWithoutQr,
  outOfDeliveryWithoutQr
}
