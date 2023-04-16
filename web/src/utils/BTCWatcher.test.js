import WS from 'jest-websocket-mock'
import MockAdapter from 'axios-mock-adapter'

import BTCWatcher from './BTCWatcher'
import mempool from '../axios/mempool'

describe('BTCWatcher Unit Tests', () => {
  let server = null
  let mempoolMock = null

  beforeEach(() => {
    mempoolMock = new MockAdapter(mempool)
    server = new WS('wss://ws.blockchain.info/inv')
  })

  afterEach(() => {
    server.close()
  })

  describe('Initializing BTCWatcher', () => {
    describe('When initializing a new BTCWatcher', () => {
      let watcher = null

      beforeEach(() => {
        watcher = new BTCWatcher()
      })

      it('should subscribe to the expected channels', async () => {
        await expect(server).toReceiveMessage(
          JSON.stringify({
            op: 'blocks_sub'
          })
        )
      })
    })
  })

  describe('Subscribing to new BTC Addresses', () => {
    describe('Given a BTCWatcher', () => {
      let watcher = null

      beforeEach(async () => {
        watcher = new BTCWatcher()
        await server.nextMessage
      })

      describe('when subscribing to new BTC Addresses', () => {
        beforeEach(() => {
          watcher.addresses = ['test-addr-one', 'test-addr-two']
        })

        it('should start listening for potential changes to the subscribed BTC Addresses', async () => {
          await expect(server).toReceiveMessage(
            JSON.stringify({
              op: 'addr_sub',
              addr: 'test-addr-one'
            })
          )

          await expect(server).toReceiveMessage(
            JSON.stringify({
              op: 'addr_sub',
              addr: 'test-addr-two'
            })
          )
        })
      })
    })
  })

  describe('Unsubscribing to existent BTC Addresses', () => {
    describe('Given a BTCWatcher', () => {
      let watcher = null

      beforeEach(async () => {
        watcher = new BTCWatcher()
        await server.nextMessage
      })

      describe('having been subscribed to a number of BTC Addresses', () => {
        beforeEach(async () => {
          watcher.addresses = [
            'test-addr-one',
            'test-addr-two',
            'test-addr-three'
          ]

          await server.nextMessage
          await server.nextMessage
          await server.nextMessage
        })

        describe('when unsubscribing from a BTC Addresses', () => {
          beforeEach(() => {
            watcher.addresses = ['test-addr-two']
          })

          it('should stop listening for potential changes to the unsubscribed BTC Addresses', async () => {
            await expect(server).toReceiveMessage(
              JSON.stringify({
                op: 'addr_unsub',
                addr: 'test-addr-one'
              })
            )

            await expect(server).toReceiveMessage(
              JSON.stringify({
                op: 'addr_unsub',
                addr: 'test-addr-three'
              })
            )
          })
        })
      })
    })
  })

  describe('Receiving an updates for subscribed BTC Addresses', () => {
    describe('Given a BTCWatcher', () => {
      let watcher = null
      let onMessage = null

      beforeEach(async () => {
        onMessage = jest.fn()

        watcher = new BTCWatcher()
        watcher.on('message', onMessage)

        await server.nextMessage
      })

      describe('having subscribed to a number of BTC Addresses', () => {
        beforeEach(async () => {
          watcher.addresses = [
            'test-addr-one',
            'test-addr-two',
            'test-addr-three'
          ]

          await server.nextMessage
          await server.nextMessage
          await server.nextMessage
        })

        describe('when an update for subscribed BTC Address is received', () => {
          beforeEach(() => {
            server.send(
              JSON.stringify({
                op: 'utx',
                x: {
                  inputs: [{ prev_out: { addr: 'test-addr-one' } }],
                  out: [{ addr: 'test-addr-one' }, { addr: 'test-addr-three' }]
                }
              })
            )
          })

          it('should inform the user that a BTC Address has been updated', () => {
            expect(onMessage).toHaveBeenCalledTimes(2)

            expect(onMessage.mock.calls[0][0]).toBe(
              'Address test-addr-one has been updated!'
            )

            expect(onMessage.mock.calls[1][0]).toBe(
              'Address test-addr-three has been updated!'
            )
          })
        })
      })
    })
  })

  describe('Receiving an updates for subscribed BTC Transaction', () => {
    describe('Given a BTCWatcher', () => {
      let watcher = null
      let onMessage = null

      beforeEach(async () => {
        onMessage = jest.fn()

        watcher = new BTCWatcher()
        watcher.on('message', onMessage)

        await server.nextMessage
      })

      describe('having subscribed to a number of BTC Transactions', () => {
        beforeEach(async () => {
          watcher.transactions = [
            'test-trx-one',
            'test-trx-two',
            'test-trx-three'
          ]
        })

        describe('when an update for a new mined block is recevied', () => {
          beforeEach(() => {
            mempoolMock
              .onGet('/block/test-block-id/txids')
              .reply(200, [
                'test-trx-one',
                'test-trx-three',
                'test-trx-five',
                'test-trx-six',
                'test-trx-seven'
              ])

            server.send(
              JSON.stringify({
                op: 'block',
                x: { hash: 'test-block-id' }
              })
            )
          })

          it('should make an HTTP Request to retrieve all the transactions that have been confirmed', () => {
            expect(mempoolMock.history.get).toHaveLength(1)

            expect(mempoolMock.history.get[0].url).toBe(
              '/block/test-block-id/txids'
            )
          })

          it('should inform the user that a new block has been mined', () => {
            expect(onMessage.mock.calls[0][0]).toBe(
              'Block test-block-id has been mined.'
            )
          })

          it('should inform the user that a BTC Address has been updated', () => {
            expect(onMessage.mock.calls[1][0]).toBe(
              'Transaction test-trx-one has been updated!'
            )

            expect(onMessage.mock.calls[2][0]).toBe(
              'Transaction test-trx-three has been updated!'
            )
          })
        })
      })
    })
  })

  describe('Failing to retrieve the newly confirmed BTC Transactions', () => {
    describe('Given a BTCWatcher', () => {
      let watcher = null
      let onError = null

      beforeEach(async () => {
        onError = jest.fn()

        watcher = new BTCWatcher()
        watcher.on('error', onError)

        await server.nextMessage
      })

      describe('having subscribed to a number of BTC Transactions', () => {
        beforeEach(async () => {
          watcher.transactions = [
            'test-trx-one',
            'test-trx-two',
            'test-trx-three'
          ]
        })

        describe('when an update for a new mined block is recevied', () => {
          beforeEach(() => {
            mempoolMock.onGet('/block/test-block-id/txids').reply(500)

            server.send(
              JSON.stringify({
                op: 'block',
                x: { hash: 'test-block-id' }
              })
            )
          })

          it('should inform the user that an issue has been encountered', () => {
            expect(onError.mock.calls[0][1]).toEqual({
              message:
                'An error has occured while attempting to check if any of your subscribed transactions have been affected'
            })
          })
        })
      })
    })
  })

  describe('Failing due to a WebSocket Error', () => {
    describe('Given a BTCWatcher', () => {
      let watcher = null
      let onError = null

      beforeEach(async () => {
        onError = jest.fn()

        watcher = new BTCWatcher()
        watcher.on('error', onError)

        await server.nextMessage
      })

      describe('when an WebSocket error occurs', () => {
        beforeEach(() => {
          server.error()
        })

        it('should inform the user that an issue has been encountered', () => {
          expect(onError.mock.calls[0][1]).toEqual({
            message:
              'Lost connection with MempoolJS. Refresh page to connect again'
          })
        })
      })
    })
  })
})
