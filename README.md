# steam-inventory-api
Steam Inventory API that can run from multiple servers to prevent being timed out by steam.

Set up is easy

```bash
$ yarn/npm install
$ yarn/npm run build
```
And you're done.

Fill in the `.env` files for each microservice and deploy them and you distributed Steam Inventory API is running. It will return an array of [`SteamItem`](src/core/SteamItem.js) instances. Unlike the real Steam Inventory API, this one returns the user's entire inventory instead of just 5000 items at a time. This means that very large inventories take very long to yield a response.

The only endpoint of the api is `/api/inventory/:steamId/:appId/:contextId`
