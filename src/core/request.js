const { Client } = require('ezrpc')

const client = new Client(
  process.env.LOAD_BALANCER_HOST,
  parseInt(process.env.LOAD_BALANCER_PORT),
  { reconnectStrategy: Client.ReconnectStrategies.Static }
)

client.on('error', error => {
  console.log(`A fatal error occurred - ${error.message}`)
  process.exit(0)
})

module.exports = client.methods
