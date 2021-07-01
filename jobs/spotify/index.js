const SpotifyWebApi = require('spotify-web-api-node')
const log = require('../../logger')
const Job = require('../../job')
const DopeAdder = require('./dopeAdder')
const currentlyCool = require('./currentlyCool')
const Spotify = require('../../globals').Spotify

async function init() {
    await refreshToken()
    Job('PT59M', async () => {
        await refreshToken()
    })

    async function refreshToken() {
        let refreshTokenResult = await Spotify.refreshAccessToken()
        Spotify.setAccessToken(refreshTokenResult.body.access_token)
    }

    DopeAdder(Spotify)
    currentlyCool(Spotify)
}

module.exports = {
    init
}
