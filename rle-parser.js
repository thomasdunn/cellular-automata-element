export class RleParser {

    isComment(line) {
        // if it starts with #, its header comment
        return line.match(/^#/) !== null;
    }

    isHeader(line) {
        // if it starts with x = or n =, its header
        return line.match(/^x\s*=/) !== null;
    }

    parseHeader(line) {
        let width;
        let height;
        let rule;

        // _________________________  x   =    3      ,   y   =    3         ,   rule   =   B3/S23
        const match = line.match(/^\s*x\s*=\s*(\d+)\s*,\s*y\s*=\s*(\d+)(?:\s*,\s*rule\s*=\s*(.*))?$/);
        if (match !== null) {
            width = parseInt(match[1], 10);
            height = parseInt(match[2], 10);
            rule = match[3];
        }

        return {width, height, rule};
    }

    parseTextComments(lines) {
        const commentLines = lines.filter(line => this.isComment(line), this);
        const textCommentLines = [];

        commentLines.forEach(line => {
            const match = line.match(/^#[Cc]\s*(.*)$/);
            if (match !== null) {
                textCommentLines.push(match[1]);
            }
        });

        return textCommentLines;
    }

    getPattern(lines) {
        const patternLines = lines
            .filter(line => ! this.isComment(line))
            .filter(line => ! this.isHeader(line));
        let patternLine = patternLines.join('');
        let endIndicatorIndex = patternLine.indexOf('!');
        if (endIndicatorIndex !== -1) {
            patternLine = patternLine.substr(0, endIndicatorIndex);
        }
        return patternLine;
    }

    parse(contents) {
        let pattern;
        const name = contents;
        const creator = contents;
        let comments = [];

        // split on newline and filter out empty lines
        const lines = contents.split(/\n/g).filter(line => line.length > 0);

        pattern = this.getPattern(lines);

        comments = this.parseTextComments(lines);
        const headerLine = lines.find(line => this.isHeader(line));
        const {width, height, rule} = this.parseHeader(headerLine);

        return {
            pattern: pattern,
            rule,
            width,
            height,
            name,
            creator,
            comments
        }
    }

    toOnCells(pattern) {
        const onCells = [];

        let x = 0;
        let y = 0;

        const on = (num=1) => {
            for (let i = 0; i < num; i++) {
                onCells.push([x++, y]);
            }
        };
        const off = (num=1) => x += num;
        const nextLine = (num=1) => {
            y += num;
            x = 0;
        };

        const nextItemRegExp = /^(\d*)?([^\d])/;
        let num;
        let chr;
        let match = pattern.match(nextItemRegExp);

        while (match !== null) {
            num = match[1];
            chr = match[2];

            if (chr === '$') {
                nextLine(num);
            }
            else if (this.isActive(chr))  {
                on(num);
            }
            else {
                off(num);
            }

            pattern = pattern.substring(match[0].length);
            if (pattern === null) {
                break;
            }
            match = pattern.match(nextItemRegExp);
        }

        return onCells;
    }

    isActive(chr) {
        switch (chr) {
        case 'b':
        case 'B':
        case '.':
            return false;
            default:
                return true;
        }
    }
}
