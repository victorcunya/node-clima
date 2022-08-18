import 'colors';
import { leerInput, listarLugares, menu, pausa } from './helpers/inquirer.js';
import { Busqueda } from './models/busqueda.js';


const main = async () => {

    let opt = '';
    let busqueda = new Busqueda();

    do {
        opt = await menu();
        switch (opt) {
            case 1:
                // mostar mensaje
                const city = await leerInput('Ciudad:');

                // busca lugares
                const lugares = await busqueda.ciudad(city);

                // selecciona lugar
                const id = await listarLugares(lugares);
                if (id === 0) continue;

                // guardar en bd
                const lugarSel = lugares.find(lugar => lugar.id === id);
                busqueda.agregarHistorial(lugarSel.nombre);

                // datos del clima
                const clima = await busqueda.getClima(lugarSel.lat, lugarSel.lon);

                // mostrar resultado
                busqueda.imprimirCiudad(lugarSel, clima);

                break;
            case 2:
                busqueda.historialCapitalizado.forEach((lugar, i) => {
                    console.log(`${i + 1}. ${lugar}`.cyan)
                })
                break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0);

}

main();
