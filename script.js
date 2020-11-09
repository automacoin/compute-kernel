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

    runtime--;

    // 1 represents the output 'ready' to new moves.
    return step(table, control, head, tape, blank, halt, runtime);

}

/** This function summarizes the preparatory settings one should set to properly configure a machine */
function boot(number, colors, states) {

    if ([...number].length > states * colors) {
        throw new Error(`ERROR: number ${number} doesn't represent a TM in the space D(${states},${colors})`);
    }

    /** The actual model of a complete Turing Machine */
    let table = [];

    const base = colors * ((2 * states) + 1);

    let r = -7;

    for (let i = 0; i < states; i++) {
        table.push([]);
        for (let j = 0; j < colors; j++) {
            table[i].push([null, null, null]);
        }
    }

    // the triple which represents a move is [control, write, dir]
    for (i = states - 1; i >= 0; i--) {
        for (j = 0; j < colors; j++) {
            r = number % base;
            number = Math.floor((number - r) / base);

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


function compute() {

    let [colors, states, blank, number, runtime] = process.argv.slice(2);
    blank = parseInt(blank);

    // The TM's Tape, blank at start
    let tape = [blank, blank];

    // the computation starts at position zero
    let head = 0;

    // the triple [table, control, halting] represents a complete turing machine 
    const table = boot(number, colors, states);

    const init = 0;
    const halt = -1;

    // the actual computation
    step(table, init, head, tape, blank, halt, runtime);

    console.log(tape.join(''));
    return 1
}

compute();

//node script.js 2 2 0 4607 20
