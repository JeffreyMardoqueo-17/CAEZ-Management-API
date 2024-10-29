import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * Obtener todos los grados.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Obtener todos los grados
 * GET http://localhost:3000/grados
 * 
 * // Respuesta:
 * // [{ "Id": 1, "Nombre": "Grado A", "Colegiatura": 100.00 }, ...]
 */
export const GetGrados = async (req, res) => {
    try {
        const result = await executeQuery('EXEC SPGradosGet');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los grados: ${error}`);
        res.status(500).json({ msg: 'Error al obtener los grados' });
    }
};

/**
 * Obtener un grado por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Obtener grado por ID
 * GET http://localhost:3000/grados/1
 * 
 * // Respuesta:
 * // { "Id": 1, "Nombre": "Grado A", "Colegiatura": 100.00 }
 */
export const GetGradoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await executeQuery('EXEC SPGetGradosPorId @Id', [{ name: 'Id', type: sql.Int, value: id }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Grado no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener el grado: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el grado' });
    }
};

/**
 * Crear un nuevo grado.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Crear nuevo grado
 * POST http://localhost:3000/grados
 * 
 * // Cuerpo de la solicitud:
 * {
 *   "Nombre": "Nuevo Grado",
 *   "Colegiatura": 150.00
 * }
 * 
 * // Respuesta:
 * // { "msg": "Grado creado correctamente", "id": 3 }
 */
export const PostGrado = async (req, res) => {
    const { Nombre, Colegiatura } = req.body;
    if (!Nombre || Colegiatura === undefined) {
        return res.status(400).json({ msg: 'Nombre y Colegiatura son requeridos' });
    }
    try {
        const result = await executeQuery('EXEC SPGradosCreate @Nombre, @Colegiatura', [
            { name: 'Nombre', type: sql.VarChar(50), value: Nombre },
            { name: 'Colegiatura', type: sql.Decimal(10, 2), value: Colegiatura }
        ]);
        res.status(201).json({ msg: 'Grado creado correctamente', id: result.recordset[0].Id });
    } catch (error) {
        console.error(`Error al insertar el grado: ${error}`);
        res.status(500).json({ msg: 'Error al insertar el grado' });
    }
};

/**
 * Actualizar un grado existente.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Actualizar grado
 * PUT http://localhost:3000/grados/1
 * 
 * // Cuerpo de la solicitud:
 * {
 *   "Nombre": "Grado Actualizado",
 *   "Colegiatura": 200.00
 * }
 * 
 * // Respuesta:
 * // { "msg": "Grado actualizado correctamente" }
 */
export const PutGrado = async (req, res) => {
    const { id } = req.params;
    const { Nombre, Colegiatura } = req.body;
    if (!Nombre || Colegiatura === undefined) {
        return res.status(400).json({ msg: 'Nombre y Colegiatura son requeridos' });
    }
    try {
        await executeQuery('EXEC SPGradosUpdate @Id, @Nombre, @Colegiatura', [
            { name: 'Id', type: sql.Int, value: id },
            { name: 'Nombre', type: sql.VarChar(50), value: Nombre },
            { name: 'Colegiatura', type: sql.Decimal(10, 2), value: Colegiatura }
        ]);
        res.status(200).json({ msg: 'Grado actualizado correctamente' });
    } catch (error) {
        console.error(`Error al actualizar el grado: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar el grado' });
    }
};

/**
 * Eliminar un grado por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @example
 * // Probar en Thunder Client:
 * // Eliminar grado por ID
 * DELETE http://localhost:3000/grados/1
 * 
 * // Respuesta:
 * // { "msg": "Grado eliminado correctamente" }
 */
export const DeleteGrado = async (req, res) => {
    const { id } = req.params;
    try {
        await executeQuery('EXEC SPGradosDelete @Id', [{ name: 'Id', type: sql.Int, value: id }]);
        res.status(200).json({ msg: 'Grado eliminado correctamente' });
    } catch (error) {
        console.error(`Error al eliminar el grado: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar el grado' });
    }
};
