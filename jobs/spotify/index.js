const SpotifyWebApi = require('spotify-web-api-node')
const log = require('../../logger')
const Job = require('../../job')
const DopeAdder = require('./dopeAdder')
const currentlyCool = require('./currentlyCool')
async function init() {
    const Spotify = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
        refreshToken: process.env.REFRESH_TOKEN
    })
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
