export class Lexicon {
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
}