/*
Class Name: DataPrevent
Class Description: DataPrevent extends on the class, DataSanitize, and is preventive by removing non-alphanumeric characters to prevent data injection attacks.
*/

const DataSanitize = require('./data-sanitize.js')

module.exports = class DataPrevent extends DataSanitize {

    constructor() {
        super()
    }

}