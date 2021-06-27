const moment = require('moment')
function Job(repeat, cb) {
    let interval = moment.duration(repeat).asMilliseconds()
    let iteration = 0
    cb(iteration)
    setInterval(() => {
        iteration++
        cb(iteration)
    }, interval)
}

module.exports = Job
