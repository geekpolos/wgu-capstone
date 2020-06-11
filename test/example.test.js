// Unit Testing
const expect = require('chai').expect;

const DataPrevent = require("../src/data-prevent.js")
let dataPrevent = new DataPrevent()
describe('data-prevent.js tests', () => {
    
    describe('data-prevent.returnOnlyLetters', () => {
        it('should remove non letter characters from String', () => {
            const result = dataPrevent.returnOnlyLetters('word1234')
            expect(result).to.equal("word")            
        })
    })

    describe('data-prevent.returnOnlyNumbers', () => {
        it('should remove non numbers from String', () => {
            const result = dataPrevent.returnOnlyNumbers('word1234')
            expect(result).to.equal("1234")            
        })
    })    

    describe('data-prevent.returnLettersNumbersSpaces', () => {
        it('should remove non letter and spaces from String', () => {
            const result = dataPrevent.returnLettersNumbersSpaces('stock ticker 42?<>')
            expect(result).to.equal("stock ticker 42")            
        })
    })
})