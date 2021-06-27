const COLOR_MAP = {
    RED: '255,0,0',
    BLUE: '0,0,255',
    GREEN: '0,255,0',
    PURPLE: '255,0,255',
    WHITE: '255,255,255',
    WARM_WHITE: '255,233,155',
    BLACK: '0,0,0',
    YELLOW: '255,255,0',
    CYAN: '0,255,255'
}
const BLOCK_SIZE = 150

for (let color in COLOR_MAP) {
    let colorElement = document.createElement('div')
    let colorBar = document.createElement('div')
    colorElement.className = 'colorElement'
    colorElement.setAttribute('brightness', '10')
    colorElement.style.backgroundColor = `rgb(${COLOR_MAP[color]
        .split(',')
        .map((c) => c - 200)
        .join(',')})`
    colorElement.style.width = `${BLOCK_SIZE}px`
    colorElement.style.height = `${BLOCK_SIZE}px`
    colorElement.style.margin = `5px`
    colorElement.style.webkitAppRegion = 'no-drag'
    colorElement.onclick = () => {
        if (color == 'WARM_WHITE') {
            setWarm(colorElement.getAttribute('brightness'))
        } else {
            colorChange(
                COLOR_MAP[color],
                colorElement.getAttribute('brightness')
            )
        }
    }
    colorElement.onwheel = (e) => {
        let multiplier = (e.deltaY / 100) * -1
        if (
            colorElement.getAttribute('brightness') >= 0 &&
            colorElement.getAttribute('brightness') <= 10
        ) {
            colorElement.setAttribute(
                'brightness',
                parseInt(colorElement.getAttribute('brightness')) + multiplier
            )
            if (colorElement.getAttribute('brightness') >= 11)
                colorElement.setAttribute('brightness', 10)
            if (colorElement.getAttribute('brightness') <= -1)
                colorElement.setAttribute('brightness', 0)
        }
        colorBar.style.height = `${
            (colorElement.getAttribute('brightness') / 10) * 100
        }%`
        if (color == 'WARM_WHITE') {
            setWarm(colorElement.getAttribute('brightness'))
        } else {
            colorChange(
                COLOR_MAP[color],
                colorElement.getAttribute('brightness')
            )
        }
    }

    colorBar.className = 'colorBar'
    colorBar.style.backgroundColor = `rgb(${COLOR_MAP[color]})`
    colorBar.style.width = '100%'
    colorBar.style.height = '100%'
    colorElement.appendChild(colorBar)
    document.body.appendChild(colorElement)
}

function colorChange(color, brightness) {
    let params = new URLSearchParams({ color, brightness })
    fetch(`http://pi/bulb/changeColor?` + params)
}

function setWarm(brightness) {
    let params = new URLSearchParams({ brightness })
    fetch(`http://pi/bulb/changeWarm?` + params)
}
