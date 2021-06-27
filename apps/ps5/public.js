let newest = ''
let sound = new Audio('alert.mp3')
let firstClick = true
document.body.innerHTML = '<h1>Click to start!</h1>'
document.addEventListener('click', () => {
    if (firstClick) {
        setInterval(() => {
            get()
        }, 5000)
        get()
        firstClick = false
    }
})

function get() {
    fetch('http://pi/ps5/get')
        .then((r) => r.json())
        .then((response) => {
            let output = ''
            if (newest != response[0].title) {
                sound.play()
                console.log('new')
            } else {
                console.log('old')
            }
            newest = response[0].title
            response.forEach((record) => {
                output += `<div>
                    ${record.html}
                </div>`
            })
            document.body.innerHTML = output
        })
}
