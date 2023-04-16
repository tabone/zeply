import * as actions from './actions'

import api from '../../axios/api'

function getByID(id) {
  return async (dispatch) => {
    const response = await api.get(`/addresses/${id}`)
    dispatch(actions.add(response.data.data))
  }
}

export { getByID }
