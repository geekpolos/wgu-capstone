/*
Class Name: DataPrevent
Class Description: DataPrevent extends on the class, DataSanitize, and is preventive by removing non-alphanumeric characters to prevent data injection attacks.
*/

const DataSanitize = require('./data-sanitize.js')

module.exports = class DataPrevent extends DataSanitize {

    constructor() {
        super()
    }

    // This will return a string with only letters.
    returnOnlyLetters(string = '') {
        let s = string        
        s = s.replace(/[^A-Za-z]/g, '')
        return s
    }

    // This will return a string with only numbers
    returnOnlyNumbers(string = '') {
        let s = string
        s = s.replace(/[^0-9]/g, '')
        return s
    }

    // This will return a string with only numbers and decimals
    returnNumbersAndDecimals(string = '') {
        let s = string
        s = s.replace(/[^0-9.]/g, '')
        return s
    }

    // This will return a string with only letters, numbers, and spaces.
    returnLettersNumbersSpaces(string = '') {
        let s = string
        s = s.replace(/[^A-Za-z0-9\s]/g, '')
        return s
    }

}