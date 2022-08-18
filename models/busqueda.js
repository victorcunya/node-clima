import axios from 'axios';
import 'colors';
import 'dotenv/config';
import fs from 'fs';

export class Busqueda {

    historial = [];
    dbPath = './db/data.json';

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {

            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))

            return palabras.join(' ');
        })
    }

    get paramsMabox() {
        return {
            'access_token': process.env.MAPBOX_TOKEN,
            'limit': 5,
            'language': 'es',
        }
    }

    async ciudad(lugar = '') {

        const instance = axios.create({
            baseURL: `${process.env.MAPBOX_URI}/${lugar}.json`,
            params: this.paramsMabox
        })
        try {
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lat: lugar.center[0],
                lon: lugar.center[1],

            }))
        } catch (error) {
            console.log(error);
            return []
        }

    }

    get paramsWeather() {
        return {
            appid: process.env.OPEN_WEATHER_TOKEN,
            units: 'metric',
            lang: 'es'
        }
    }

    async getClima(lat, lon) {

        const instance = axios.create({
            baseURL: process.env.OPEN_WEATHER_URI,
            params: { ...this.paramsWeather, lat, lon }
        })

        try {
            const resp = await instance.get()
            const { weather, main } = resp.data
            return {
                description: weather[0].description,
                temp: main.temp,
                temp_min: main.temp_min,
                temp_max: main.temp_max
            }
        } catch (error) {
            console.log(error);
            return []
        }
    }

    imprimirCiudad(lugar = {}, clima = {}) {
        console.clear();
        console.log('Información de la ciudad'.green);
        console.log('ciudad:'.cyan, `${lugar.nombre}`.yellow);
        console.log('latitude:'.cyan, lugar.lat);
        console.log('longitude:'.cyan, lugar.lon);
        console.log('Temperatura:'.cyan, clima.temp);
        console.log('Mínima:'.cyan, clima.temp_min);
        console.log('Máxima:'.cyan, clima.temp_max);
        console.log('Cómo está el clima?'.cyan, clima.description.yellow);
    }

    agregarHistorial(lugar = '') {

        // TODO: prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) return;

        this.historial = this.historial.slice(0, 5)
        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB() {

        if (!fs.existsSync(this.dbPath)) return null;
        const file = fs.readFileSync(this.dbPath, 'utf8');
        const data = JSON.parse(file);
        this.historial = data.historial;
    }

}
