const querystring = require('querystring')

const SteamItem = require('./SteamItem')
const { get } = require('./request')

/**
 * Class that loads a user's inventory
 * @property {String} steamId
 * @property {Number} appId
 * @property {String} contextId
 * @property {String} language
 * @property {SteamItemAsset[]} assets - array of all SteamItemAssets
 * @property {Map<String, SteamItemDescription>} descriptions - maps classid-instanceid to SteamItemDescriptions
 */
class SteamInventoryLoader {
  /**
   * Constructs a SteamInventoryLoader
   * @param {String} steamId
   * @param {Number} appId
   * @param {String} contextId
   * @param {String} [language=en]
   */
  constructor (steamId, appId, contextId, language = 'en') {
    if (typeof steamId !== 'string') throw new Error('Steamid has to be a string')
    if (typeof appId !== 'number') throw new Error('Appid must be a number')
    if (typeof contextId !== 'string') throw new Error('Contextid must be a string')
    this.steamId = steamId
    this.appId = appId
    this.contextId = contextId
    this.language = language

    this.assets = []
    this.descriptions = new Map()
  }

  /**
   * @typedef {Object} SteamInventoryResponse
   * @property {SteamItemAsset[]} assets
   * @property {SteamItemDescription[]} descriptions
   * @property {0 | 1} more_items
   * @property {String} last_assetid
   * @property {Number} total_inventory_count
   * @property {0 | 1} success
   * @property {Number} rwgrsn
   */

  /**
   * Fetches a batch of Steam items
   * @param {*} [startAssetId] - the assetid of the item last fetched
   * @param {*} [count=5000] - the amont of items to fetch
   * @returns {Promise<SteamInventoryResponse>}
   */
  getItems (startAssetId, count = 5000) {
    const qs = querystring.stringify({ l: this.language, startAssetId, count })
    return get(`https://steamcommunity.com/inventory/${this.steamId}/${this.appId}/${this.contextId}?${qs}`)
      .then(response => {
        console.log(response)
        if (response.status !== 200) return Promise.reject(new Error('Non-200 status code'))
        const { data } = response
        if (!data.success) return Promise.reject(new Error('No success'))
        if (!data.assets) return Promise.reject(new Error('Inventory is private/empty'))
        console.log(data)
        return data
      })
  }

  /**
   * Fetches a Steam inventory
   * @returns {SteamItem[]} Steam Inventory
   */
  async getInventory () {
    let lastAssetId
    let moreItems = true
    let errors = 0
    while (moreItems) {
      try {
        let assets, descriptions
        ({ assets, descriptions, more_items: moreItems, last_assetid: lastAssetId } = await this.getItems(lastAssetId, 5000))
        console.log(`got ${assets.length} items`)
        errors = 0
        this.assets.push(...assets)
        descriptions.forEach(description => this.descriptions.set(`${description.classid}-${description.instanceid}`, description))
      } catch (error) {
        errors++
        console.log(`Could not get Steam inventory items - ${error.message}`)
        if (errors >= 7 || error.message === 'Missing assets') throw new Error(`Could not fetch inventory - ${error.message}`)
      }
    }

    const items = []
    this.assets.forEach(asset => items.push(new SteamItem(asset, this.descriptions.get(`${asset.classid}-${asset.instanceid}`))))
    return items
  }
}

module.exports = SteamInventoryLoader
