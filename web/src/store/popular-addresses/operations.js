import * as actions from './actions'

import api from '../../axios/api'

function get() {
  return async (dispatch) => {
    const response = await api.get('/reports/popular-addresses')
    dispatch(actions.add(...response.data.data))
  }
}

export { get }
