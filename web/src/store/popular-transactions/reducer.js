import { Map } from 'immutable'

import * as types from './types'

export default function reducer(state = new Map(), action = {}) {
  switch (action.type) {
    case types.ADD: {
      return action.data.reduce((newState, record) => {
        if (record.id == null) return newState

        return ['id', 'hits'].reduce((newState, attribute) => {
          const value = record[attribute]
          if (value == null) return newState
          return newState.setIn([record.id, attribute], value)
        }, newState)
      }, state)
    }

    case types.REMOVE: {
      return action.data == null ? new Map() : state.delete(action.data)
    }

    default:
      return state
  }
}
