import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * @function GetRoles
 * @description Obtiene todos los roles.
 * @route GET /api/roles
 * @returns {Object[]} Lista de roles.
 * @throws {Error} Si ocurre un error al obtener los roles.
 * @example Thunder Client:
 * GET /api/roles
 */
export const GetRoles = async (req, res) => {
    try {
        const result = await executeQuery('EXEC SPRoleGet');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los roles: ${error}`);
        res.status(500).json({ msg: 'Error al obtener los roles' });
    }
};

/**
 * @function GetRolPorId
 * @description Obtiene un rol por su Id.
 * @route GET /api/roles/:id
 * @param {number} id - Id del rol a obtener.
 * @returns {Object} Rol correspondiente al Id especificado.
 * @throws {Error} Si ocurre un error al obtener el rol.
 * @example Thunder Client:
 * GET /api/roles/1
 */
export const GetRolPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await executeQuery('EXEC SPRoleGet @Id', [{ name: 'Id', type: sql.INT, value: id }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Rol no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener el rol: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el rol' });
    }
};

/**
 * @function PostRol
 * @description Crea un nuevo rol.
 * @route POST /api/roles
 * @param {string} Nombre - Nombre del rol.
 * @returns {Object} Mensaje de éxito y el Id del rol creado.
 * @throws {Error} Si ocurre un error al insertar el rol.
 * @example Thunder Client:
 * POST /api/roles
 * Body (JSON):
 * {
 *     "Nombre": "Admin"
 * }
 */
export const PostRol = async (req, res) => {
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'El campo nombre es requerido' });
    }
    try {
        const result = await executeQuery('EXEC SPRoleCreate @Name', [{ name: 'Name', type: sql.VarChar(30), value: Nombre }]);
        res.status(201).json({ msg: 'Rol creado correctamente', id: result.recordset[0].Id });
    } catch (error) {
        console.error(`Error al insertar el rol: ${error}`);
        res.status(500).json({ msg: 'Error al insertar el rol' });
    }
};

/**
 * @function PutRol
 * @description Actualiza un rol existente.
 * @route PUT /api/roles/:id
 * @param {number} id - Id del rol a actualizar.
 * @param {string} Nombre - Nuevo nombre del rol.
 * @returns {Object} Mensaje de éxito y el rol actualizado.
 * @throws {Error} Si ocurre un error al actualizar el rol.
 * @example Thunder Client:
 * PUT /api/roles/1
 * Body (JSON):
 * {
 *     "Nombre": "SuperAdmin"
 * }
 */
export const PutRol = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'El campo nombre es requerido' });
    }
    try {
        const result = await executeQuery('EXEC SPRoleUpdate @Id, @Name', [
            { name: 'Id', type: sql.INT, value: id },
            { name: 'Name', type: sql.VarChar(30), value: Nombre }
        ]);

        res.status(200).json({ msg: 'Rol actualizado correctamente', rol: result.recordset[0] });
    } catch (error) {
        console.error(`Error al actualizar el rol: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar el rol' });
    }
};

/**
 * @function DeleteRol
 * @description Elimina un rol por su Id.
 * @route DELETE /api/roles/:id
 * @param {number} id - Id del rol a eliminar.
 * @returns {Object} Mensaje de éxito.
 * @throws {Error} Si ocurre un error al eliminar el rol.
 * @example Thunder Client:
 * DELETE /api/roles/1
 */
export const DeleteRol = async (req, res) => {
    const { id } = req.params;
    try {
        await executeQuery('EXEC SPRoleDelete @Id', [{ name: 'Id', type: sql.INT, value: id }]);
        res.status(200).json({ msg: 'Rol eliminado correctamente' });
    } catch (error) {
        console.error(`Error al eliminar el rol: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar el rol' });
    }
};
