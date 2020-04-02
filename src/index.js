/* ezrpc-server */

require('dotenv').config()

const express = require('express')

const InventoryController = require('./controllers/InventoryController')
const InventoryControllerValidation = require('./validation/InventoryControllerValidation')

const app = express()

app.get('/api/inventory/:steamId/:appId/:contextId',
  InventoryControllerValidation.validateGetInventory,
  InventoryController.getInventory)

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))
