import * as types from './types'

function add(...data) {
  return {
    data,
    type: types.ADD
  }
}

function remove(entityID) {
  return { data: entityID, type: types.REMOVE }
}

export { add, remove }
