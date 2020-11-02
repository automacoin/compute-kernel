let direction;

/**@enum direction*/
(function (direction) {
    direction[direction["LEFT"] = 0] = "LEFT";
    direction[direction["RIGHT"] = 1] = "RIGHT";
    direction[direction["STOP"] = 2] = "STOP";
})(direction || (direction = {}));

class TransitionResult {
    constructor(control, writeSymbol, dir) {
        this.control = control;
        this.writeSymbol = writeSymbol;
        this.dir = dir;
    }
}

class TuringMachineState {
    constructor(control, head, dir) {
        this.control = control;
        this.head = head;
        this.dir = dir;
    }
}

class TuringMachine {
    constructor(colors, states, blank, haltingState, state, initialControlState, transitionTable) {
        this.colors = colors;
        this.states = states;
        this.haltingState = haltingState;
        this.initialControlState = initialControlState;
        this.blank = blank;
        this.states = state;
        this.transitionTable = [];
    }
}

class Tape {
    constructor() {
        this._tape = [0];
        this._head = 0;
        this.blank = 'B';
    }

    moveRight() {
        if (this._head === this._tape.length - 1) {
            this._tape.push(this.blank);
        }
        this._head++
    }

    moveLeft() {
        if (this._head === 0) {
            this._tape.unshift(this.blank);
        }
        this._head--;
    }

    write(color) {
        this._tape[this._head] = color;
    }

    get symbol() {
        return this._tape[this._head]
    }

    print() {
        return this._tape;
    }
}

function runStep(m, t) {

    tr = m.transitionTable[m.state.control][t.symbol]

    t.write(tr.writeSymbol);
    m.state.control = tr.control;

    if (tr.control === m.haltingState) {
        return 0;
    }

    switch (tr.dir) {
        case direction.RIGHT:
            t.moveRight();
            break;
        case direction.LEFT:
            t.moveLeft();
            break;
        default:
            return 0
    }

    return 1;

}

function initTuringMachine(states, colors, blank, numberTM) {

    m = new TuringMachine();
    m.colors = colors;
    m.states = states;
    m.haltingState = -1;
    m.initialControlState = 0;
    m.blank = blank;

    m.state = new TuringMachineState();
    m.state.control = m.initialControlState;


    let i = 0;
    let j = 0;
    let gr;
    let gc;
    let rest;

    //fill the transition table table
    for (i = states - 1; i >= 0; i--) {
        m.transitionTable[i] = []
        for (j = 0; j < colors; j++) {
            gc = Math.floor(numberTM / (colors * ((2 * states) + 1)));
            gr = numberTM - gc * (colors * ((2 * states) + 1));

            numberTM = gc;
            rest = gr;
            

            m.transitionTable[i][j] = new TransitionResult()
            if (rest < colors) {
                m.transitionTable[i][j].control = m.haltingState;
                m.transitionTable[i][j].writeSymbol = rest;
                m.transitionTable[i][j].dir = direction.STOP
            } else {
                rest -= colors;
                m.transitionTable[i][j].writeSymbol = (rest % colors);
                m.transitionTable[i][j].dir = ((rest % 2 == 0) ? direction.RIGHT : direction.LEFT);
                m.transitionTable[i][j].control = (rest % states);
            }
        }
    }

    return m;

}

(function () {
    const m = initTuringMachine(2, 2, 'B', 231);
    const t = new Tape();

    for (i = 0; i < 20000 && runStep(m, t); i++) {
    }

    

})()