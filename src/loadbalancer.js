/* ezrpc-load-balancer */

require('dotenv').config()

const { LoadBalancer } = require('ezrpc')

// eslint-disable-next-line
const server = new LoadBalancer(
  process.env.SERVERS.split(',').map(address => ({
    host: address.split(':')[0],
    port: parseInt(address.split(':')[1])
  })),
  parseInt(process.env.LOAD_BALANCER_PORT)
)
