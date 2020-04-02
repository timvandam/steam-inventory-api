const SteamInventoryLoader = require('../core/SteamInventoryLoader')

/**
 * Fetches a user's inventory
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 * @param {Function} next - Express next method
 */
function getInventory (req, res, next) {
  const { steamId, appId, contextId } = req.params
  const inventoryLoader = new SteamInventoryLoader(steamId, appId, contextId)
  inventoryLoader.getInventory()
    .then(items => res.status(200).json({ items }))
    .catch(error => res.status(500).json({ error }))
}

module.exports = {
  getInventory
}
