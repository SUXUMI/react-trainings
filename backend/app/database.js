const mongoose = require('mongoose')
const config = require('./config')

try {
    const { db: { host, port, name } } = config
    const connectionString = `mongodb://${host}:${port}/${name}`
    mongoose.connect(
        connectionString,
        {
            useNewUrlParser: true
        }
    )
}
catch(e) {
    throw new Error('Unable to connect database')
}

module.exports = mongoose