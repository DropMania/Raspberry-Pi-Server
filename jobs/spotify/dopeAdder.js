const log = require('../../logger')
const Job = require('../../job')
const {getAllPlaylistTracks} = require('./spotifyUtils')

function DopeAdder(Spotify) {
    let timeToAdd = 30
    let dope = '2pyjH91WD16a4rdzlBzM3Q'
    let currentTrack = ''
    let timeLeft = timeToAdd

    Job('PT3S', async () => {
        let playingState = await Spotify.getMyCurrentPlaybackState()
        if (playingState.body.item) {
            if (playingState.body.item.type == 'track') {
                if (playingState.body.item.uri != currentTrack) {
                    currentTrack = playingState.body.item.uri
                    timeLeft = timeToAdd
                } else {
                    if (playingState.body.is_playing) {
                        timeLeft--
                    }
                    if (timeLeft == 0) {
                        if (currentTrack != '') {
                            let allTracks = await getAllPlaylistTracks(
                                Spotify,
                                dope
                            )
                            if (!allTracks.includes(currentTrack)) {
                                Spotify.addTracksToPlaylist(dope, [
                                    currentTrack
                                ])
                                console.log(
                                    'Track added!: ',
                                    playingState.body.item.name
                                )
                                log('spotify-track-added', {
                                    track: {
                                        name: playingState.body.item.name,

                                        uri: playingState.body.item.uri,
                                        url: playingState.body.item
                                            .external_urls.spotify
                                    },
                                    artists: playingState.body.item.artists.map(
                                        (artist) => {
                                            return {
                                                name: artist.name,
                                                uri: artist.uri,
                                                url: artist.external_urls
                                                    .spotify
                                            }
                                        }
                                    )
                                })
                            }
                        }
                    }
                }
            }
        }
    })
}



module.exports = DopeAdder