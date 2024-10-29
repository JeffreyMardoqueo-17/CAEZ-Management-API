import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * Método para obtener todos los parentezcos.
 * @route GET /Parentezcos
 * @example http://localhost:5000/Parentezcos
 */
export const GetParentezcos = async (req, res) => {
    try {
        const result = await executeQuery('EXEC SPParentezcoGet');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los parentezcos: ${error}`);
        res.status(500).json({ msg: 'Error al obtener los parentezcos' });
    }
};

/**
 * Método para obtener un parentezco por su Id.
 * @route GET /Parentezcos/:id
 * @param {number} id - El ID del parentezco a obtener.
 * @example http://localhost:5000/Parentezcos/6
 */
export const GetParentezcoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await executeQuery('EXEC SPGetParentezcoPorId @Id', [{ name: 'Id', type: sql.INT, value: id }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Parentezco no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener el parentezco: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el parentezco' });
    }
};

/**
 * Método para insertar un nuevo parentezco.
 * @route POST /Parentezcos
 * @param {string} Nombre - El nombre del parentezco a insertar.
 * @example
 * {
 *   "Nombre": "Primo"
 * }
 */
export const PostParentezco = async (req, res) => {
    const { Nombre } = req.body;
    try {
        const result = await executeQuery('EXEC SPParentezcoCreate @Nombre', [{ name: 'Nombre', type: sql.VarChar(50), value: Nombre }]);
        res.status(201).json({ msg: 'Parentezco creado correctamente', id: result.recordset[0].Id });
    } catch (error) {
        console.error(`Error al insertar el parentezco: ${error}`);
        res.status(500).json({ msg: 'Error al insertar el parentezco' });
    }
};

/**
 * Método para actualizar un parentezco existente.
 * @route PUT /Parentezcos/:id
 * @param {number} id - El ID del parentezco a actualizar.
 * @param {string} Nombre - El nuevo nombre del parentezco.
 * @example
 * http://localhost:5000/Parentezcos/5  
 * {
 *   "Nombre": "Tío"
 * }
 */
export const PutParentezco = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    try {
        await executeQuery('EXEC SPParentezcoUpdate @Id, @Nombre', [{ name: 'Id', type: sql.INT, value: id }, { name: 'Nombre', type: sql.VarChar(50), value: Nombre }]);
        res.status(200).json({ msg: 'Parentezco actualizado correctamente' });
    } catch (error) {
        console.error(`Error al actualizar el parentezco: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar el parentezco' });
    }
};

/**
 * Método para eliminar un parentezco por su Id.
 * @route DELETE /Parentezcos/:id
 * @param {number} id - El ID del parentezco a eliminar.
 * @example http://localhost:5000/Parentezcos/5
 */
export const DeleteParentezco = async (req, res) => {
    const { id } = req.params;
    try {
        await executeQuery('EXEC SPParentezcoDelete @Id', [{ name: 'Id', type: sql.INT, value: id }]);
        res.status(200).json({ msg: 'Parentezco eliminado correctamente' });
    } catch (error) {
        console.error(`Error al eliminar el parentezco: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar el parentezco' });
    }
};

// Ejemplo de cómo usar Thunder Client:

// 1. Obtener todos los parentezcos
// - Método: GET
// - URL: http://localhost:5000/Parentezcos

// 2. Obtener un parentezco por ID
// - Método: GET
// - URL: http://localhost:5000/Parentezcos/1

// 3. Crear un nuevo parentezco
// - Método: POST
// - URL: http://localhost:5000/Parentezcos
// - Cuerpo (JSON):
// {
//   "Nombre": "Primo"
// }

// 4. Actualizar un parentezco existente
// - Método: PUT
// - URL: http://localhost:5000/Parentezcos/1
// - Cuerpo (JSON):
// {
//   "Nombre": "Tío"
// }

// 5. Eliminar un parentezco
