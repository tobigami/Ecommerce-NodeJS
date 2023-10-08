'use strict'

const mongoose = require('mongoose')
const connectString = `mongodb://127.0.0.1/123`
const {countConnect} = require('../helper/check.connect')

class DataBase {
    constructor() {
        this.connect()
    }

    // connect
    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(connectString).then(_ => {
            console.log('connect DB success PRO')
            countConnect()
        }).catch(err => {
        console.log('connect fail')})
    }

    static getInstance() {
        if(!DataBase.instance) {
            DataBase.instance = new DataBase()
        }

        return DataBase.instance
    }

    // disconnect() {
    //     mongoose.disconnect().then(_ => console.log('disconnect DB success PRO')).catch(err => {
    //         console.log('disconnect fail')})
    // }
}

const instanceMongooseDB = DataBase.getInstance()
module.exports = instanceMongooseDB