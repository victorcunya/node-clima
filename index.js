const { menu, pausa } = require("./helpers/inquirer")


const main = async () => {

    let opt = '';

    do {
        opt = await menu();
        console.log(opt);
        if (opt !== 0) await pausa();
    } while (opt !== 0);
}

main();
