function renderData(data) {
    document.title = data.TEMP + '°'
    document.body.innerHTML = `
    ${data.TEMP}&deg;C
    <br>
    ${data.HUM}%
    <br>
    ${data.PI}&deg;C`
}

async function getData() {
    let res = await fetch('http://pi/temp/get')
    let data = await res.json()
    return data
}
getData().then((data) => {
    renderData(data)
})
setInterval(async () => {
    let data = await getData()
    renderData(data)
}, 5000)
