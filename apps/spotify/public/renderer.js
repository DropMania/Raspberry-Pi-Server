loadCurrentlyCool()
let ccArr = []
async function loadCurrentlyCool() {
    let ccResponse = await fetch('http://pi/spotify/currentlyCool')
    ccArr = await ccResponse.json()
    renderCC()
}

function renderCC() {
    let el = document.getElementById('currentlyCool')
    ccArr.sort((a, b) => b[1].listenTime - a[1].listenTime)
    for (let [id, songData] of ccArr) {
        let fieldset = document.createElement('fieldset')
        let legend = document.createElement('legend')
        legend.textContent = songData.track.name
        fieldset.appendChild(legend)
        let div = document.createElement('div')
        div.innerHTML = `listenTime = ${songData.listenTime_formatted} <br>
        lastListening = ${songData.lastListening_formatted}`
        fieldset.appendChild(div)
        el.appendChild(fieldset)
    }
}
