import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * Obtener todos los grados.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 */
export const GetGrados = async (req, res) => {
    try {
        // Llama al procedimiento almacenado SPGradosGet sin parámetros para obtener todos los grados
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
 */
export const GetGradoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        // Llama al procedimiento almacenado SPGradosGet con el parámetro Id para obtener el grado específico
        const result = await executeQuery('EXEC SPGradosGet @Id', [{ name: 'Id', type: sql.Int, value: id }]);
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
 */
export const PostGrado = async (req, res) => {
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'Nombre es requerido' });
    }
    try {
        // Llama al procedimiento almacenado SPGradosCreate con el parámetro Nombre para crear un nuevo grado
        const result = await executeQuery('EXEC SPGradosCreate @Nombre', [
            { name: 'Nombre', type: sql.VarChar(50), value: Nombre }
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
 */
export const PutGrado = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'Nombre es requerido' });
    }
    try {
        // Llama al procedimiento almacenado SPGradosUpdate con los parámetros Id y Nombre para actualizar el grado
        const result = await executeQuery('EXEC SPGradosUpdate @Id, @Nombre', [
            { name: 'Id', type: sql.Int, value: id },
            { name: 'Nombre', type: sql.VarChar(50), value: Nombre }
        ]);

        if (result.recordset.length > 0) {
            res.status(200).json({ msg: 'Grado actualizado correctamente', updatedRecord: result.recordset[0] });
        } else {
            res.status(404).json({ msg: 'Grado no encontrado' });
        }
    } catch (error) {
        console.error(`Error al actualizar el grado: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar el grado' });
    }
};

/**
 * Eliminar un grado por su ID.
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 */
export const DeleteGrado = async (req, res) => {
    const { id } = req.params;
    try {
        // Llama al procedimiento almacenado SPGradosDelete con el parámetro Id para eliminar el grado
        await executeQuery('EXEC SPGradosDelete @Id', [{ name: 'Id', type: sql.Int, value: id }]);
        res.status(200).json({ msg: 'Grado eliminado correctamente' });
    } catch (error) {
        console.error(`Error al eliminar el grado: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar el grado' });
    }
};
