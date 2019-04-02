import { RleParser } from "./rle-parser.js";

export class PatternLoader {
    constructor(collectionsUrl) {
        this.parser = new RleParser();
        this.collectionsUrl = collectionsUrl;
    }

    async getRleData(collectionName, patternName) {
        const parser = this.parser;

        return fetch(`${this.collectionsUrl}/patterns/${collectionName}/${patternName}.rle`)
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

    async getPatternIndex() {
        return fetch(`${this.collectionsUrl}/index.json`)
            .then(response => response.json());
    }
}