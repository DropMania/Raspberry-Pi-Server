const SpotifyWebApi = require('spotify-web-api-node')

Spotify = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: process.env.REFRESH_TOKEN
})

module.exports = {
    Spotify
}
