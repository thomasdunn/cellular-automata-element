import { RleParser } from "./rle-parser.js";

export class PatternLoader {
    constructor(collectionsUrl) {
        this.parser = new RleParser();
        this.collectionsUrl = collectionsUrl;
    }

    async getRleData(collectionName, patternName) {
        const parser = this.parser;
        const url = `${this.collectionsUrl}/patterns/${collectionName}/${patternName}.rle`;
        console.log(`***Url*** ${url}`);
        return fetch(url)
            .then(response => {
                console.log(`Fetch ${response.url} - ${response.status}: ${response.statusText} ${JSON.stringify(response.headers)}`);
                return response.text();
            })
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