/* ezrpc-requester */

require('dotenv').config()

const { Server } = require('ezrpc')
const axios = require('axios')

const server = new Server(parseInt(process.env.REQUESTER_PORT))

server.module.exports = {
  get (url) {
    return axios.get(url)
      .catch(error => Promise.reject(error.toJSON()))
      .then(response => {
        if (response.status !== 200) return Promise.reject(new Error('Non-200 status code'))
        const { data } = response
        return data
      })
  }
}
