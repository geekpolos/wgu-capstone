/*
Class Name: DataSanitize
Class Description: To provide basic data sanitize functionality to check for numbers, strings, or boolean values.
*/

module.exports = class DataSanitize {
    
    constructor() {
        this.name = "Data Sanitize Class"
    }

    // Getter Method
    getName() {
        return `${this.name}`
    }

    // Setter Method
    setName(newName) {
        this.name = newName
    }

    // Check to see if data is a number
    numberSanitize(data) {
        return Number.isInteger(data)
    }

    // Check to see if data is a string
    stringSanitize(data) {
        return typeof data === 'string'
    }

    // Check to see if data is a boolean
    booleanSanitize(data) {
        return typeof data === 'boolean'
    }

};