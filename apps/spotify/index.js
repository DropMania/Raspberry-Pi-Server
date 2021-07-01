const express = require('express')
const app = express()
const fs = require('fs')
const Spotify = require('../../globals').Spotify
const moment = require('moment')
const durationPlugin = require('moment-duration-format')
durationPlugin(moment)

app.use(express.static(__dirname + '/public'))
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
