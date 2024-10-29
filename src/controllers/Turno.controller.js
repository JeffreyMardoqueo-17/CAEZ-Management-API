import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * Obtener todos los turnos.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Obtener todos los turnos
 * GET http://localhost:3000/turnos
 * 
 * // Respuesta:
 * // [{ "Id": 1, "Nombre": "Turno 1" }, { "Id": 2, "Nombre": "Turno 2" }]
 */
export const GetTurnos = async (req, res) => {
    try {
        const result = await executeQuery('EXEC SPTurnosGet');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los turnos: ${error}`);
        res.status(500).json({ msg: 'Error al obtener los turnos' });
    }
};

/**
 * Obtener un turno específico por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Obtener turno por ID
 * GET http://localhost:3000/Turnos/1
 * 
 * // Respuesta:
 * // { "Id": 1, "Nombre": "Turno 1" }
 */
export const GetTurnoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await executeQuery('EXEC SPGetTurnosPorId @Id', [{ name: 'Id', type: sql.INT, value: id }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Turno no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener el turno: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el turno' });
    }
};

/**
 * Crear un nuevo turno.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Crear nuevo turno
 * POST http://localhost:3000/Turnos
 * 
 * // Cuerpo de la solicitud:
 * {
 *   "Nombre": "Nuevo Turno"
 * }
 * 
 * // Respuesta:
 * // { "msg": "Turno creado correctamente", "id": 3 }
 */
export const PostTurno = async (req, res) => {
    const { Nombre } = req.body;
    try {
        const result = await executeQuery('EXEC SPTurnosCreate @Nombre', [{ name: 'Nombre', type: sql.VarChar(80), value: Nombre }]);
        res.status(201).json({ msg: 'Turno creado correctamente', id: result.recordset[0].Id });
    } catch (error) {
        console.error(`Error al insertar el turno: ${error}`);
        res.status(500).json({ msg: 'Error al insertar el turno' });
    }
};

/**
 * Actualizar un turno existente.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Actualizar turno
 * PUT http://localhost:3000/Turnos/1
 * 
 * // Cuerpo de la solicitud:
 * {
 *   "Nombre": "Turno Actualizado"
 * }
 * 
 * // Respuesta:
 * // { "msg": "Turno actualizado correctamente", "turno": { "Id": 1, "Nombre": "Turno Actualizado" } }
 */
export const PutTurno = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    try {
        const result = await executeQuery('EXEC SPTurnosUpdate @Id, @Nombre', [
            { name: 'Id', type: sql.INT, value: id },
            { name: 'Nombre', type: sql.VarChar(80), value: Nombre }
        ]);
        res.status(200).json({ msg: 'Turno actualizado correctamente', turno: result.recordset[0] });
    } catch (error) {
        console.error(`Error al actualizar el turno: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar el turno' });
    }
};

/**
 * Eliminar un turno por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Eliminar turno
 * DELETE http://localhost:3000/Turnos/1
 * 
 * // Respuesta:
 * // { "msg": "Turno eliminado correctamente" }
 */
export const DeleteTurno = async (req, res) => {
    const { id } = req.params;
    try {
        await executeQuery('EXEC SPTurnosDelete @Id', [{ name: 'Id', type: sql.INT, value: id }]);
        res.status(200).json({ msg: 'Turno eliminado correctamente' });
    } catch (error) {
        console.error(`Error al eliminar el turno: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar el turno' });
    }
};
