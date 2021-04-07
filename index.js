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


// example: $ node index.js -s 2 -c 2 -r 20 -f 4607 -l 4615

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
    .requiredOption('-s,--states <number>', 'Number of states')
    .requiredOption(
        '-c,--colors <number>',
        'Number of colors',
    )
    .requiredOption(
        '-r,--runtime <number>',
        'Max runtime',
    )
    .requiredOption(
        '-f,--first <number>',
        'First machine to compute',
    )
    .requiredOption(
        '-l,--last <number>',
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
        console.log('\n[[Compute Kernel]] computation output saved in file computation.txt\n');
    });

}

if (program.quiet != 1) {
    console.log('\nFinal output: \n\n', result);
}

