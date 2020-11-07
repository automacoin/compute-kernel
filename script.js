/** This function define the behaviour of what is a single step of a turing machine computation */
function step(m, t) {
    r = m.table[m.description.control][t.read()];

    t.inscribe(r.write);
    m.description.control = r.control;

    // 0 represents the halting interrupt
    if (r.control === m.halting) {
        return 0;
    }

    switch (r.dir) {
        case 0:
            t.toLeft();
            break;
        case 2:
            t.toRight();
            break;
    }

    // 1 represents the output 'ready' to new moves.
    return 1;

}

/** This function summarizes the preparatory settings one should set to properly configure a machine */
function boot(colors, states, blank, number) {

    if ([...number].length > states * colors) {
        return console.log(`{ERROR: number ${number} doesn't represent a TM in the space D(${states},${colors})`);
    }

    /** The actual object which models a complete Turing Machine */
    let m = {
        table: [],
        colors,
        states,
        blank,
        halting: -1,
        description: {
            control: 0
        },
        init: 0

    }

    const base = colors * ((2 * states) + 1);
    //console.log('Base: ', base)
    let r;

    for (let i = 0; i < states; i++) {
        m.table.push([]);
        for (let j = 0; j < colors; j++) {
            m.table[i].push({});
        }
    }

    for (i = states - 1; i >= 0; i--) {
        for (j = 0; j < colors; j++) {
            r = number % base;
            number = Math.floor((number - r) / base);

            if (r < colors) {
                m.table[i][j].control = m.halting;
                m.table[i][j].write = r;
                m.table[i][j].dir = 1;
            } else {
                r = r - colors;
                m.table[i][j].write = (r % colors);
                r = Math.floor(r / colors);
                m.table[i][j].dir = ((r % 2) == 0 ? 2 : 0);
                r = Math.floor(r / 2);
                m.table[i][j].control = (r % states);
            }
        }
    }

    return m;

}


function compute() {

    let [colors, states, blank, number, runtime] = process.argv.slice(2);
    blank = parseInt(blank);

    /** The TM's Tape blueprint with the allowable moves */
    let t = {
        _tape: [blank],
        _head: 0,
        blank: blank,


        toRight: function () {
            if (this._head === this._tape.length - 1) {
                this._tape.push(this.blank);
            }
            this._head++;
        },

        toLeft: function () {
            if (this._head === 0) {
                this._tape.unshift(this.blank);
            }
            this._head--;
        },

        inscribe: function (symbol) {
            this._tape[this._head] = symbol;
        },

        read: function () {
            return this._tape[this._head];
        },

        print: function () {
            return this._tape;
        },
    }

    let m = boot(colors, states, blank, number);

    while (step(m, t) > 0 && runtime --> 0) { }

    return console.log(t.print());
}

compute();

