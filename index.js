const direction;

/**@enum direction*/
(function (direction) {
    direction[direction["LEFT"] = 0] = "LEFT";
    direction[direction["RIGHT"] = 1] = "RIGHT";
    direction[direction["STOP"] = 1] = "STOP";
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
    constructor(colors, states, haltingState, state, initialControlState, transitionTable) {
        this.colors = colors;
        this.states = states;
        this.haltingState = haltingState;
        this.initialControlState = initialControlState;
        this.blank = blank;
        this.states = state;
        this.transitionTable = transitionTable;
    }
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
        for (j = 0; j < colors; j++) {
            gc = Math.floor(numberTM / (colors * ((2 * states) + 1)));
            gr = numberTM - gc * (colors * ((2 * states) + 1));

            rest = gr;
            numberTM = gc;

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