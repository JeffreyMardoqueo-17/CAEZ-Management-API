
// import { GetConnection } from '../DataBase/contection/Conexion';
import { GetConnection } from "../DataBase/contection/Conexion";

/**
 * Ejecuta una consulta SQL con parámetros.
 *
 * @param {string} query - La consulta SQL a ejecutar.
 * @param {Array} parameters - Una lista de parámetros para la consulta.
 * Cada parámetro debe ser un objeto con las propiedades 'name', 'type' y 'value'.
 *
 * @returns {Promise} Una promesa que se resuelve con el resultado de la consulta.
 */
export const executeQuery = async (query, parameters = []) => {
    try {
        const pool = await GetConnection();
        let request = pool.request();
        parameters.forEach(param => request.input(param.name, param.type, param.value));
        return await request.query(query);
    } catch (error) {
        console.error('Error al ejecutar la consulta: ' + error);
    }
};

/**
 * Ejecuta una consulta SQL con parámetros incrustados en la cadena de consulta.
 *
 * ATENCIÓN: Esta función no escapa ni valida los parámetros, por lo que puede ser vulnerable a ataques de inyección SQL.
 * Asegúrate de validar y/o escapar todos los parámetros antes de usarlos en la consulta.
 *
 * @param {string} query - La consulta SQL a ejecutar.
 *
 * @returns {Promise} Una promesa que se resuelve con el resultado de la consulta.
 */
export const executeRawQuery = async (query) => {
    try {
        const pool = await GetConnection();
        let request = pool.request();
        return await request.query(query);
    } catch (error) {
        console.error('Error al ejecutar la consulta: ' + error);
    }
};