import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * @description Obtiene todos los tipos de documento o un tipo de documento por ID.
 * @route GET /tipos-documento
 * @queryParam {number} [id] - ID del tipo de documento (opcional). Si no se proporciona, devuelve todos los tipos de documento.
 * @response 200 - Lista de tipos de documento.
 * @response 500 - Error al obtener los tipos de documento.
 */
export const GetTiposDocumento = async (req, res) => {
    const { id } = req.query; // Se usa req.query para capturar parámetros de consulta
    try {
        let query = 'EXEC SPTipoDocumentosGet';
        const params = [];

        if (id) {
            query += ' @Id';
            params.push({ name: 'Id', type: sql.Int, value: parseInt(id) });
        }

        const result = await executeQuery(query, params);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los tipos de documento: ${error}`);
        res.status(500).json({ msg: 'Error al obtener los tipos de documento' });
    }
};

/**
 * @description Obtiene un tipo de documento por ID.
 * @route GET /tipos-documento/:id
 * @param {number} id - ID del tipo de documento.
 * @response 200 - Tipo de documento encontrado.
 * @response 404 - Tipo de documento no encontrado.
 * @response 500 - Error al obtener el tipo de documento.
 */
export const GetTipoDocumentoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await executeQuery('EXEC SPGetTipoDocumentosPorId @Id', [{ name: 'Id', type: sql.Int, value: parseInt(id) }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Tipo de documento no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener el tipo de documento: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el tipo de documento' });
    }
};

/**
 * @description Crea un nuevo tipo de documento.
 * @route POST /tipos-documento
 * @body {string} Nombre - Nombre del tipo de documento.
 * @response 201 - Tipo de documento creado correctamente con el ID.
 * @response 400 - El campo nombre es requerido.
 * @response 500 - Error al insertar el tipo de documento.
 */
export const PostTipoDocumento = async (req, res) => {
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'El campo nombre es requerido' });
    }
    try {
        const result = await executeQuery('EXEC SPTipoDocumentosCreate @Nombre', [{ name: 'Nombre', type: sql.VarChar(50), value: Nombre }]);
        res.status(201).json({ msg: 'Tipo de documento creado correctamente', id: result.recordset[0].Id });
    } catch (error) {
        console.error(`Error al insertar el tipo de documento: ${error}`);
        res.status(500).json({ msg: 'Error al insertar el tipo de documento' });
    }
};

/**
 * @description Actualiza un tipo de documento existente.
 * @route PUT /tipos-documento/:id
 * @param {number} id - ID del tipo de documento a actualizar.
 * @body {string} Nombre - Nuevo nombre del tipo de documento.
 * @response 200 - Tipo de documento actualizado correctamente.
 * @response 400 - El campo id y nombre son requeridos.
 * @response 404 - Tipo de documento no encontrado.
 * @response 500 - Error al actualizar el tipo de documento.
 */
export const PutTipoDocumento = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    if (!id || !Nombre) {
        return res.status(400).json({ msg: 'El campo id y nombre son requeridos' });
    }
    try {
        const result = await executeQuery('EXEC SPTipoDocumentosUpdate @Id, @Nombre', [
            { name: 'Id', type: sql.Int, value: parseInt(id) },
            { name: 'Nombre', type: sql.VarChar(50), value: Nombre }
        ]);
        if (result.recordset.length > 0) {
            res.status(200).json({ msg: 'Tipo de documento actualizado correctamente', tipoDocumento: result.recordset[0] });
        } else {
            res.status(404).json({ msg: 'Tipo de documento no encontrado' });
        }
    } catch (error) {
        console.error(`Error al actualizar el tipo de documento: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar el tipo de documento' });
    }
};

/**
 * @description Elimina un tipo de documento existente.
 * @route DELETE /tipos-documento/:id
 * @param {number} id - ID del tipo de documento a eliminar.
 * @response 200 - Tipo de documento eliminado correctamente.
 * @response 400 - El campo id es requerido.
 * @response 500 - Error al eliminar el tipo de documento.
 */
export const DeleteTipoDocumento = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'El campo id es requerido' });
    }
    try {
        await executeQuery('EXEC SPTipoDocumentosDelete @Id', [{ name: 'Id', type: sql.Int, value: parseInt(id) }]);
        res.status(200).json({ msg: 'Tipo de documento eliminado correctamente' });
    } catch (error) {
        console.error(`Error al eliminar el tipo de documento: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar el tipo de documento' });
    }
};
