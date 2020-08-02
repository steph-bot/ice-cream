const assert = require('assert');
const simulation = require('../src/index');
// could also use should.js

const expectedInput = {};

describe('Sample unit test', () => {
    it('should run without errors.', () => {
        const expectedOutput = simulation(10);
        assert.deepStrictEqual(expectedInput, expectedOutput);
    });
});