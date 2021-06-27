async function getAllPlaylistTracks(Spotify, playlist) {
    let tracks = []
    let hasTracks = true
    let idx = 0
    while (hasTracks) {
        let trackParts = await Spotify.getPlaylistTracks(playlist, {
            limit: 100,
            offset: idx * 100
        })
        tracks = [...tracks, ...trackParts.body.items.map((t) => t.track.uri)]
        if (trackParts.body.items.length < 100) {
            hasTracks = false
        }
        idx++
    }
    return tracks
}
module.exports = {
    getAllPlaylistTracks
}