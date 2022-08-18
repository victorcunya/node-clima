import 'colors';
import inquirer from 'inquirer';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
];


const menu = async () => {

    console.clear();
    console.log('============================'.green);
    console.log('   Seleccione una opción'.magenta);
    console.log('============================\n'.green);

    return inquirer.prompt(preguntas)
        .then(answers => answers.opcion);
}

const pausa = async () => {
    const pregunta = [
        {
            type: 'input',
            name: 'enter',
            message: `Presiona ${'enter'.green} para continuar`,
        }
    ]

    console.log('\n');
    return inquirer.prompt(pregunta)
        .then(answers => answers.enter);
}

const leerInput = async (message) => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate(value) {
                if (value.length === 0) {
                    return 'por favor ingrese un valor';
                }
                return true;
            }
        }
    ]

    return await inquirer.prompt(question)
        .then(answers => answers.description);
}

const listarLugares = async (lugares = []) => {

    const choices = lugares.map((lugar, index) => {
        const idx = `${index + 1}.`.green
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    })

    choices.unshift({
        value: 0,
        name: '0.'.green + ' Cancelar'
    })

    const question = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]

    return inquirer.prompt(question)
        .then(answers => answers.id)
}

export {
    menu, pausa, leerInput, listarLugares
};
