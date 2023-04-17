import EventEmitter from 'eventemitter3'

import mempoolAPI from '../axios/mempool'
import truncateEntityID from '../utils/truncate-entity-id'

export default class BTCWatcher extends EventEmitter {
  constructor() {
    super()

    this._addresses = []
    this._transactions = []
    this._intervalID = null
    this._ws = new window.WebSocket('wss://ws.blockchain.info/inv')

    this._ws.addEventListener('open', () => {
      this.emit('open')

      this._ws.send(JSON.stringify({ op: 'blocks_sub' }))

      this._intervalID = window.setInterval(() => {
        this._ws.send(JSON.stringify({ op: 'ping' }))
      }, 10000)
    })

    this._ws.addEventListener('error', (err) => {
      this.emit('error', err, {
        message: 'Lost connection with MempoolJS. Refresh page to connect again'
      })

      this.destroy()
    })

    this._ws.addEventListener('close', () => this.destroy())

    this._ws.addEventListener('message', (ev) => {
      const { op, x: payload } = JSON.parse(ev.data)

      if (op === 'utx') handleUTXOperation(this, payload)
      if (op === 'block') handleBlockOperation(this, payload)
    })
  }

  get addresses() {
    return [...this._addresses]
  }

  get transactions() {
    return [...this._transactions]
  }

  set addresses(addresses) {
    const currentAddresses = [...this._addresses]

    currentAddresses.forEach((addressID) => {
      if (addresses.includes(addressID) === true) return

      this._ws.send(
        JSON.stringify({
          op: 'addr_unsub',
          addr: addressID
        })
      )
    })

    addresses.forEach((addressID) => {
      if (this._addresses.includes(addressID) === true) return

      this._ws.send(
        JSON.stringify({
          op: 'addr_sub',
          addr: addressID
        })
      )
    })

    this._addresses = [...addresses]
  }

  set transactions(transactions) {
    this._transactions = [...transactions]
  }

  destroy() {
    window.clearInterval(this._intervalID)
    if (this._ws.readyState === WebSocket.OPEN) this._ws.close()
  }
}

function handleUTXOperation(self, payload) {
  ;[
    ...payload.out.map((output) => output.addr),
    ...payload.inputs.map((input) => input.prev_out.addr)
  ]
    .reduce((addresses, addressID) => {
      if (self._addresses.includes(addressID) === true) addresses.add(addressID)
      return addresses
    }, new Set())
    .forEach((addressID) => {
      self.emit(
        'message',
        `Address ${truncateEntityID(addressID)} has been updated!`
      )
    })
}

async function handleBlockOperation(self, payload) {
  const blockID = payload.hash
  self.emit('message', `Block ${truncateEntityID(blockID)} has been mined.`)

  try {
    const response = await mempoolAPI.get(`/block/${blockID}/txids`)

    response.data.forEach((transactionID) => {
      if (self._transactions.includes(transactionID) === false) return

      self.emit(
        'message',
        `Transaction ${truncateEntityID(transactionID)} has been updated!`
      )
    })
  } catch (err) {
    self.emit('error', err, {
      message:
        'An error has occured while attempting to check if any of your subscribed transactions have been affected'
    })
  }
}
