const log = require('../../logger')
const Job = require('../../job')
const SpotifyWebApi = require('spotify-web-api-node')
const fs = require('fs')
const {getAllPlaylistTracks} = require('./spotifyUtils')
/**
 * 
 * @param {SpotifyWebApi} Spotify 
 */
function currentlyCool(Spotify){
    let playlist = '74xHDxBtQvnCJStRWZC3Sy'
    let addTime = 1200000
    let deleteTime = 172800000
    Job('PT5S',async ()=>{
        let playbackState = (await Spotify.getMyCurrentPlaybackState()).body
        let tracks = JSON.parse(fs.readFileSync(__dirname+'/tracks.json'))
        if(playbackState.is_playing && playbackState.currently_playing_type == 'track'){
            if(!tracks.hasOwnProperty(playbackState.item.id)){
                tracks[playbackState.item.id] = {
                    listenTime: 0,
                    lastListening: Number(new Date())
                }
            }else{
                let track = tracks[playbackState.item.id]
                track.listenTime = track.listenTime + 5000
                track.lastListening = Number(new Date())
            }
        }
        let allTracks = await getAllPlaylistTracks(Spotify,playlist)
        for(trackId in tracks){
            let trackUri = `spotify:track:${trackId}`
            if(tracks[trackId].listenTime > addTime && !allTracks.includes(trackUri)){
                await Spotify.addTracksToPlaylist(playlist,[trackUri])
                log('spotify-currently-cool',{action: 'added', track: trackUri})
            }
            let deltaTime = Number(new Date()) - tracks[trackId].lastListening
            if(deltaTime > deleteTime){
                await Spotify.removeTracksFromPlaylist(playlist,[{uri: trackUri}])
                log('spotify-currently-cool',{action: 'deleted', track: trackUri})
                delete tracks[trackId]
            }
        }
        fs.writeFileSync(__dirname+'/tracks.json',JSON.stringify(tracks))
    })
}
module.exports = currentlyCool