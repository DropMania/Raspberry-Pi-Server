const express = require('express')
const app = express()
const fs = require('fs')
const Spotify = require('../../globals').Spotify
const moment = require('moment')
const bodyParser = require('body-parser')
const durationPlugin = require('moment-duration-format')
durationPlugin(moment)

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json())

app.get('/getall', async (req, res) => {
    let playbackState = await Spotify.getMyCurrentPlaybackState()
    let playlists = await Spotify.getUserPlaylists()
    let recommends = await Spotify.getMyTopTracks()

    res.send({
        playbackState: playbackState.body,
        playlists: playlists.body,
        recommends: recommends.body
    })
})
app.post('/getall', async (req, res) => {
    let playbackState = await Spotify.getMyCurrentPlaybackState()
    res.send({ playbackState: playbackState.body })
})
app.post('/toggle', async (req, res) => {
    let {device} = req.body
    let playbackState = await Spotify.getMyCurrentPlaybackState()
    let msg = 'done'

    if (playbackState.body.is_playing) {
        await Spotify.pause().catch((e) => {
            msg = 'no device'
        })
    } else {
        await Spotify.play({device_id:device}).catch((e) => {
            msg = 'no device'
        })
    }
    res.send({ msg })
})
app.post('/next', async (req, res) => {
    await Spotify.skipToNext()
    let msg = 'done'
    res.send({ msg })
})
app.post('/prev', async (req, res) => {
    await Spotify.skipToPrevious()
    let msg = 'done'
    res.send({ msg })
})
app.post('/addToPlaylist', async (req, res) => {
    let { pId, tURI } = req.body
    await Spotify.addTracksToPlaylist(pId, [tURI])
    let msg = 'done'
    res.send({ msg })
})
app.post('/playSong', async (req, res) => {
    let { uri, device } = req.body
    /* await Spotify.addToQueue(uri,{device_id:device})
    await Spotify.skipToNext({device_id: device}) */
    await Spotify.play({
        uris: [uri], device_id:device
    })
    let msg = 'done'
    res.send({ msg })
})
app.get('/access_token',async (req,res)=>{
    let at = await Spotify.getAccessToken()
    res.send({at})
})
app.get('/currentlyCool', async (req, res) => {
    let ccContent = JSON.parse(
        fs.readFileSync(__dirname + '/../../jobs/spotify/tracks.json')
    )
    let ccArr = Object.entries(ccContent)
    let ids = ccArr.map(([id]) => id)

    let tracks = await getTracksData(ids)

    res.send(
        ccArr.map((song, idx) => {
            song[1].track = tracks[idx]
            song[1].listenTime_formatted = moment
                .duration(song[1].listenTime)
                .format('hh:mm:ss')
            song[1].lastListening_formatted = moment(
                song[1].lastListening
            ).format('DD.MM.YYYY HH:mm:ss')

            return song
        })
    )
})

async function getTracksData(ids) {
    let amount = 50
    let offset = 0
    let hasTracks = true
    let allTracks = []
    while (hasTracks) {
        let tracks = []
        try {
            tracks = (
                await Spotify.getTracks(ids.slice(offset, offset + amount))
            ).body.tracks
        } catch (r) {}

        offset += amount
        allTracks = [...allTracks, ...tracks]
        if (tracks.length == 0) {
            hasTracks = false
        }
    }
    return allTracks
}

module.exports = { app }
