export class PatternSelector extends EventTarget {
    constructor(patterns) {
        super();
        this.patterns = patterns;
        this.select = document.createElement('select');
        this.select.addEventListener('change', function(event) {
            // event.preventDefault();
            this.dispatchEvent(new CustomEvent('patternselected', {
                detail: event.target.value
            }));
        }.bind(this));
    }

    render(parent) {
        this.patterns.forEach(pattern => {
            const opt = document.createElement('option');
            opt.value = opt.text = pattern;
            this.select.add(opt);
        });

        const defaultOpt = document.createElement('option');
        defaultOpt.text = 'Select pattern...';
        this.select.add(defaultOpt, 0);

        parent.appendChild(this.select);
    }
}