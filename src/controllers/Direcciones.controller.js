import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';


/**
 * Obtener todas las direcciones o una dirección específica por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Obtener todas las direcciones
 * GET http://localhost:3000/direcciones
 * 
 * // Obtener una dirección específica
 * GET http://localhost:3000/direcciones/{id}
 * 
 * // Respuesta:
 * // { "Id": 1, "Nombre": "Dirección 1" }
 */

export const GetDirecciones = async (req, res) => {
    const { id } = req.params; // Se asume que el ID puede ser opcional
    try {
        let query = 'EXEC SPDireccionesGet @Id';
        let params = id ? [{ name: 'Id', type: sql.INT, value: id }] : [{ name: 'Id', type: sql.INT, value: null }];

        const result = await executeQuery(query, params);
        if (id && result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Dirección no encontrada' });
        }
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener las direcciones: ${error}`);
        res.status(500).json({ msg: 'Error al obtener las direcciones' });
    }
};

/**
 * Obtener una dirección específica por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Obtener dirección por ID
 * GET http://localhost:3000/direcciones/{id}
 * 
 * // Respuesta:
 * // { "Id": 1, "Nombre": "Dirección 1" }
 */
export const GetDireccionPorId = async (req, res) => {
    const { id } = req.params; // Obtiene el ID desde los parámetros de la solicitud
    try {
        // Ejecuta el procedimiento almacenado para obtener una dirección por ID
        const result = await executeQuery('EXEC SPGetDireccionesPorId @Id', [
            { name: 'Id', type: sql.TinyInt, value: id } // Utiliza sql.TinyInt según el tipo de dato en la base de datos
        ]);
        if (result.recordset.length > 0) {
            // Si se encuentra la dirección, devuelve los datos
            res.status(200).json(result.recordset[0]);
        } else {
            // Si no se encuentra, devuelve un mensaje de error 404
            res.status(404).json({ msg: 'Dirección no encontrada' });
        }
    } catch (error) {
        // Captura y maneja cualquier error durante la ejecución
        console.error(`Error al obtener la dirección: ${error}`);
        res.status(500).json({ msg: 'Error al obtener la dirección' });
    }
};

/**
 * Crear una nueva dirección.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Crear nueva dirección
 * POST http://localhost:3000/direcciones
 * 
 * // Cuerpo de la solicitud:
 * {
 *   "Nombre": "Nueva Dirección"
 * }
 * 
 * // Respuesta:
 * // { "msg": "Dirección creada correctamente", "id": 3 }
 */
export const PostDireccion = async (req, res) => {
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'El campo Nombre es requerido' });
    }
    try {
        const result = await executeQuery('EXEC SPDireccionesCreate @Nombre', [{ name: 'Nombre', type: sql.VarChar(200), value: Nombre }]);
        res.status(201).json({ msg: 'Dirección creada correctamente', id: result.recordset[0].Id });
    } catch (error) {
        console.error(`Error al insertar la dirección: ${error}`);
        res.status(500).json({ msg: 'Error al insertar la dirección' });
    }
};

/**
 * Actualizar una dirección existente por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Actualizar dirección por ID
 * PUT http://localhost:3000/direcciones/{id}
 * 
 * // Cuerpo de la solicitud:
 * {
 *   "Nombre": "Dirección Actualizada"
 * }
 * 
 * // Respuesta:
 * // { "msg": "Dirección actualizada correctamente", "direccion": { "Id": 1, "Nombre": "Dirección Actualizada" } }
 */
export const PutDireccion = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'El campo Nombre es requerido' });
    }
    try {
        const result = await executeQuery('EXEC SPDireccionesUpdate @Id, @Nombre', [
            { name: 'Id', type: sql.INT, value: id },
            { name: 'Nombre', type: sql.VarChar(200), value: Nombre }
        ]);
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Dirección no encontrada' });
        }
        res.status(200).json({ msg: 'Dirección actualizada correctamente', direccion: result.recordset[0] });
    } catch (error) {
        console.error(`Error al actualizar la dirección: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar la dirección' });
    }
};

/**
 * Eliminar una dirección por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Eliminar dirección por ID
 * DELETE http://localhost:3000/direcciones/{id}
 * 
 * // Respuesta:
 * // { "msg": "Dirección eliminada correctamente" }
 */
export const DeleteDireccion = async (req, res) => {
    const { id } = req.params;
    try {
        await executeQuery('EXEC SPDireccionesDelete @Id', [{ name: 'Id', type: sql.INT, value: id }]);
        res.status(200).json({ msg: 'Dirección eliminada correctamente' });
    } catch (error) {
        console.error(`Error al eliminar la dirección: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar la dirección' });
    }
};
