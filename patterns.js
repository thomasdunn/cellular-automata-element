class Patterns {

    getPattern(name) {
        return new Promise((resolve, reject) => {
            fetch('lexicon.json')
                .then(function(response) {
                    return response.json();
                })
                .then(function(patterns) {
                    const pattern = patterns.find(p => p.name === name);
                    resolve(pattern);
                });
        })

    }
}