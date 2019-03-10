import { RleParser } from "./rle-parser.js";

export class Lexicon {
    constructor() {
        this.parser = new RleParser();
    }

    async getData(patternName) {
        return fetch('lexicon.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(patterns) {
                const pattern = patterns.find(p => p.name === patternName);
                return pattern;
            });
    }

    async getRleData(patternName) {
        const parser = this.parser;

        return fetch(`lifewiki-pattern-collection/${patternName}.rle`)
            .then(response => response.text())
            .then(function(rleData) {
                const {pattern, width, height} = parser.parse(rleData);
                return {
                    pattern: parser.toOnCells(pattern),
                    width,
                    height
                };
            });
    }

}