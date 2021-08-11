/**********************************************************************************************************************************************
**                   ___      __    __  .___________. ______   .___  ___.      ___       ______   ______    __  .__   __.                    **
**                  /   \    |  |  |  | |           |/  __  \  |   \/   |     /   \     /      | /  __  \  |  | |  \ |  |                    **  
**                 /  ^  \   |  |  |  | `---|  |----|  |  |  | |  \  /  |    /  ^  \   |  ,----'|  |  |  | |  | |   \|  |                    **  
**                /  /_\  \  |  |  |  |     |  |    |  |  |  | |  |\/|  |   /  /_\  \  |  |     |  |  |  | |  | |  . `  |                    **  
**               /  _____  \ |  `--'  |     |  |    |  `--'  | |  |  |  |  /  _____  \ |  `----.|  `--'  | |  | |  |\   |                    **  
**              /__/     \__\ \______/      |__|     \______/  |__|  |__| /__/     \__\ \______| \______/  |__| |__| \__|                    **  
**    ______   ______   .___  ___. .______    __    __  .___________._______     __  ___  _______ .______     .__   __.  _______  __         **
**   /      | /  __  \  |   \/   | |   _  \  |  |  |  | |           |   ____|    |  |/  / |   ____||   _  \    |  \ |  | |   ____||  |       **
**  |  ,----'|  |  |  | |  \  /  | |  |_)  | |  |  |  | `---|  |----|  |__       |  '  /  |  |__   |  |_)  |   |   \|  | |  |__   |  |       **
**  |  |     |  |  |  | |  |\/|  | |   ___/  |  |  |  |     |  |    |   __|      |    <   |   __|  |      /    |  . `  | |   __|  |  |       **
**  |  `----.|  `--'  | |  |  |  | |  |      |  `--'  |     |  |    |  |____     |  .  \  |  |____ |  |\  \----|  |\   | |  |____ |  `----.  **
**   \______| \______/  |__|  |__| | _|       \______/      |__|    |_______|    |__|\__\ |_______|| _| `._____|__| \__| |_______||_______|  **
**                                                                                                                                           **
***********************************************************************************************************************************************/

/** A JavaScript library for arbitrary-precision decimal and non-decimal arithmetic */
const BigNumber = require('bignumber.js');


/** all the step of computation till to runtime */
function allstep(table, control, head, tape, blank, halt, runtime) {
    while (runtime > 0) {
        table, runtime = onestep(table, control, head, tape, blank, halt, runtime)
        runtime--;
    }
}

/** This function define the behaviour of what is a single step of a turing machine computation */
function onestep(table, control, head, tape, blank, halt, runtime) {

    let result = table[control][tape[head]];

    // the triple which represents a move is [control, write, dir]
    tape[head] = result[1]
    control = result[0];

    // 0 represents the halting interrupt
    if (result[0] === halt) {
        return { tape, runtime: -1 };
    }

    if (result[2] > 1) {
        if (head === tape.length - 1) {
            tape.push(blank);
        }
        head++;
    } else {
        if (head === 0) {
            tape.unshift(blank);
        }
    }


    return { tape, runtime };

}



/************************************************************************************************/

/** This function define the behaviour of what is a single step of a turing machine computation */
function step(table, control, head, tape, blank, halt, runtime) {

    let result = table[control][tape[head]];

    // the triple which represents a move is [control, write, dir]
    tape[head] = result[1]
    control = result[0];

    // 0 represents the halting interrupt
    if (result[0] === halt || runtime === 0) {
        return tape;
    }

    if (result[2] > 1) {
        if (head === tape.length - 1) {
            tape.push(blank);
        }
        head++;
    } else {
        if (head === 0) {
            tape.unshift(blank);
        }
    }

    // 1 represents the output 'ready' to new moves.
    return step(table, control, head, tape, blank, halt, --runtime);

}

/** This function summarizes the preparatory settings one should set to properly configure a machine */
function boot(number, colors, states) {

    if (number.toString().length > states * colors) {
        throw new Error(`ERROR: number ${number} doesn't represent a TM in the space D(${states},${colors})`);
    }

    /** The actual model of a complete Turing Machine */
    let table = [];
    const base = colors * ((2 * states) + 1);

    let r;
    let gr;

    for (let i = 0; i < states; i++) {
        table.push([]);
        for (let j = 0; j < colors; j++) {
            table[i].push([null, null, null]);
        }
    }

    // the triple which represents a move is [control, write, dir]
    for (i = states - 1; i >= 0; i--) {
        for (j = 0; j < colors; j++) {
            gr = number.modulo(base);
            number = number.minus(gr).idiv(base);

            r = gr.toNumber();

            if (r < colors) {
                table[i][j][0] = -1; //halting state
                table[i][j][1] = r;
                table[i][j][2] = 1;
            } else {
                r = r - colors;
                table[i][j][1] = (r % colors);
                r = Math.floor(r / colors);
                table[i][j][2] = ((r % 2) == 0 ? 2 : 0);
                r = Math.floor(r / 2);
                table[i][j][0] = (r % states);
            }
        }
    }


    return table;

}

/** This routine executes a batch of turing machine and gives back to the caller the array of output tapes */
function compute(states, colors, runtime, currentTM, lastTM, quietMode) {

    // Arguments:
    // - <states>
    // - <colors>
    // - max runtime
    // - first TM
    // - last TM

    let tape;
    let head;
    let table;
    let output = [];

    const blank = 0;
    const init = 0;
    const halt = -1;

    runtime = parseInt(runtime);
    states = parseInt(states);
    colors = parseInt(colors);

    let current = new BigNumber(currentTM);
    let last = new BigNumber(lastTM);

    start = Date.now();

    if (quietMode != 1) {
        console.log("\n[[Automacoin Kernel]]", `computing turing machines in the space D(${states},${colors}) in the interval (${currentTM},${lastTM}) with max runtime ${runtime}.\n`);
    }

    while (current.isLessThanOrEqualTo(last)) {

        // The TM's Tape, blank at start
        tape = [blank];

        // the computation starts at position zero
        head = 0;

        // the triple [table, control, halting] represents a complete turing machine 
        table = boot(current, colors, states);

        console.log(`\n\n\nTable of TM ${current}: \n`, table, "\n\n\n");

        // the actual computation, is a recursion until runtime is reached or the machine halts
        allstep(table, init, head, tape, blank, halt, runtime);

        if (quietMode != 1) {
            console.log(`\n[[Automacoin Kernel]] turing machine ${current.toString()} has been executed with output tape: `, tape.join(''));
        }

        output.push(tape.join(''));

        current = current.plus(1);
    }

    return {
        states,
        colors,
        runtime,
        interval: [currentTM, lastTM],
        duration: Date.now() - start,
        tapes: output
    }
}

module.exports = { compute };