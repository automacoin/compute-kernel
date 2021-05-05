#!/usr/bin/env node


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


// example:      $ node index.js -S 2 -C 2 -R 20 -F 4607 -L 4615
// same example: $ node index.js --states 2 --colors 2 --runtime 20 --first 4607 --last 4615

// Arguments:
// - <states>
// - <colors>
// - max runtime
// - first TM
// - last TM
const program = require('commander');

program
    .version('0.0.1')
    .name('automacoin-kernel')
    .description('Portable Turing Machine simulator')
    .requiredOption('-S,--states <number>', 'Number of states')
    .requiredOption(
        '-C,--colors <number>',
        'Number of colors',
    )
    .requiredOption(
        '-R,--runtime <number>',
        'Max runtime',
    )
    .requiredOption(
        '-F,--first <number>',
        'First machine to compute',
    )
    .requiredOption(
        '-L,--last <number>',
        'Last machine to compute',
    ).option('-q,--quiet <number>',
        'set as 1 if no log is needed'
    ).option('-o,--output <number>',
        'set as 1 if you want to save the output');;


program.parse(process.argv)

result = require('./script').compute(program.states, program.colors, program.runtime, program.first, program.last, program.quiet)

if (program.output == 1) {
    require('fs').writeFile('computation.txt', JSON.stringify(result), function (err) {
        if (err) return console.log(err);
        console.log('\n[[Automacoin Kernel]] computation output saved in file computation.txt\n');
    });

}

if (program.quiet != 1) {
    console.log('\noutput: \n\n', JSON.stringify(result), '\n');
}

