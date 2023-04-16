import * as types from './types'

function add(...data) {
  return {
    data,
    type: types.ADD
  }
}

function remove() {
  return { type: types.REMOVE }
}

export { add, remove }
