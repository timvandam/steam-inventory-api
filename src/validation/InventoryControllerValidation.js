/**
 * Validates a GET /api/inventory request
 * @param {Express.Request} req - Express request object
 * @param {Express.Response} res - Express response object
 * @param {Function} next - Express next method
 */
function validateGetInventory (req, res, next) {
  const { steamId, appId, contextId } = req.params
  if (!steamId) return req.status(400).json({ error: 'No steamid was provided' })
  if (!appId) return req.status(400).json({ error: 'No appid was provided' })
  if (!contextId) return req.status(400).json({ error: 'No contextid was provided' })
  if (isNaN(appId)) return req.status(400).json({ error: 'Appid must be a number' })
  if (isNaN(contextId)) return req.status(400).json({ error: 'Contextid must be a number' })
  req.params.appId = parseInt(appId)
  next()
}

module.exports = {
  validateGetInventory
}
