/** It is needed a ENUM type which could express all possible move, now are three. */
let direction

(function (direction) {
    direction[direction["LEFT"] = 0] = "LEFT";
    direction[direction["RIGHT"] = 0] = "RIGHT";
    direction[direction["STOP"] = 0] = "STOP";
})(direction || (direction = {}));

/** The TM's Tape blueprint with the allowable moves */
class Tape {
    constructor(blank) {
        this._tape = [blank];
        this._head = 0;
        this.blank = blank;
    }

    toRight() {
        if (this._head === this._tape.length - 1) {
            this._tape.push(this.blank);
        }
        this._head++;
    }

    toLeft() {
        if (this._head === 0) {
            this._tape.unshift(this.blank);
        }
        this._head--;
    }

    inscribe(symbol) {
        this._tape[this._head] = symbol;
    }

    read() {
        return this._tape[this._head];
    }

    print() {
        return this._tape;
    }
}


/** Here a definition of a triple which expresses the result of a single step of computation */
class Result {
    constructor(control, write, dir) {
        this.control = control;
        this.write = write;
        this.dir = dir;
    }
}

/** The following class represents the instantaneous description of a TM */
class Description {
    constructor(control, head) {
        this.control = control;
        this.head = head;
    }
}

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
        case direction.LEFT:
            t.toLeft();
            break;
        case direction.RIGHT:
            t.toRight();
            break;
    }

    // 1 represents the output 'ready' to new moves.
    return 1;

}

/** The actual class which models a complete Turing Machine */
class TuringMachine {
    constructor(colors, states, blank, halting, description, init) {
        this.table = [];
        this.colors = colors;
        this.states = states;
        this.blank = blank;
        this.halting = halting;
        this.description = description;
        this.init = init;
    }
}