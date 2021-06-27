const fs = require('fs')
const moment = require('moment')

moment.locale('de')

function log(filename, data) {
    if (!fs.existsSync(`${__dirname}/logs/${filename}.json`)) {
        fs.writeFileSync(`${__dirname}/logs/${filename}.json`, '[]')
    }
    let fileData = JSON.parse(
        fs.readFileSync(`${__dirname}/logs/${filename}.json`)
    )
    fileData.unshift({
        ...data,
        timestamp: moment().format('LLLL')
    })
    fs.writeFileSync(
        `${__dirname}/logs/${filename}.json`,
        JSON.stringify(fileData)
    )
}

module.exports = log
