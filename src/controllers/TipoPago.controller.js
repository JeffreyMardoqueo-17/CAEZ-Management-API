import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

/**
 * @description Obtiene todos los tipos de pago o un tipo de pago por ID.
 * @route GET /tipos-pago
 * @queryParam {number} [id] - ID del tipo de pago (opcional). Si no se proporciona, devuelve todos los tipos de pago.
 * @response 200 - Lista de tipos de pago.
 * @response 500 - Error al obtener los tipos de pago.
 */
export const GetTiposPago = async (req, res) => {
    const { id } = req.query; // Se usa req.query para capturar parámetros de consulta
    try {
        let query = 'EXEC SPTipoPagosGet';
        const params = [];

        if (id) {
            query += ' @Id';
            params.push({ name: 'Id', type: sql.Int, value: parseInt(id) });
        }

        const result = await executeQuery(query, params);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los tipos de pago: ${error}`);
        res.status(500).json({ msg: 'Error al obtener los tipos de pago' });
    }
};

/**
 * @description Obtiene un tipo de pago por ID.
 * @route GET /tipos-pago/:id
 * @param {number} id - ID del tipo de pago.
 * @response 200 - Tipo de pago encontrado.
 * @response 404 - Tipo de pago no encontrado.
 * @response 500 - Error al obtener el tipo de pago.
 */
export const GetTipoPagoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await executeQuery('EXEC SPGetTipoPagosPorId @Id', [{ name: 'Id', type: sql.Int, value: parseInt(id) }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Tipo de pago no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener el tipo de pago: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el tipo de pago' });
    }
};

/**
 * @description Crea un nuevo tipo de pago.
 * @route POST /tipos-pago
 * @body {string} Nombre - Nombre del tipo de pago.
 * @response 201 - Tipo de pago creado correctamente con el ID.
 * @response 400 - El campo nombre es requerido.
 * @response 500 - Error al insertar el tipo de pago.
 */
export const PostTipoPago = async (req, res) => {
    const { Nombre } = req.body;
    if (!Nombre) {
        return res.status(400).json({ msg: 'El campo nombre es requerido' });
    }
    try {
        const result = await executeQuery('EXEC SPTipoPagosCreate @Nombre', [{ name: 'Nombre', type: sql.VarChar(80), value: Nombre }]);
        res.status(201).json({ msg: 'Tipo de pago creado correctamente', id: result.recordset[0].Id });
    } catch (error) {
        console.error(`Error al insertar el tipo de pago: ${error}`);
        res.status(500).json({ msg: 'Error al insertar el tipo de pago' });
    }
};

/**
 * @description Actualiza un tipo de pago existente.
 * @route PUT /tipos-pago/:id
 * @param {number} id - ID del tipo de pago a actualizar.
 * @body {string} Nombre - Nuevo nombre del tipo de pago.
 * @response 200 - Tipo de pago actualizado correctamente.
 * @response 400 - El campo id y nombre son requeridos.
 * @response 404 - Tipo de pago no encontrado.
 * @response 500 - Error al actualizar el tipo de pago.
 */
export const PutTipoPago = async (req, res) => {
    const { id } = req.params;
    const { Nombre } = req.body;
    if (!id || !Nombre) {
        return res.status(400).json({ msg: 'El campo id y nombre son requeridos' });
    }
    try {
        const result = await executeQuery('EXEC SPTipoPagosUpdate @Id, @Nombre', [
            { name: 'Id', type: sql.Int, value: parseInt(id) },
            { name: 'Nombre', type: sql.VarChar(80), value: Nombre }
        ]);
        if (result.recordset.length > 0) {
            res.status(200).json({ msg: 'Tipo de pago actualizado correctamente', tipoPago: result.recordset[0] });
        } else {
            res.status(404).json({ msg: 'Tipo de pago no encontrado' });
        }
    } catch (error) {
        console.error(`Error al actualizar el tipo de pago: ${error}`);
        res.status(500).json({ msg: 'Error al actualizar el tipo de pago' });
    }
};

/**
 * @description Elimina un tipo de pago existente.
 * @route DELETE /tipos-pago/:id
 * @param {number} id - ID del tipo de pago a eliminar.
 * @response 200 - Tipo de pago eliminado correctamente.
 * @response 400 - El campo id es requerido.
 * @response 500 - Error al eliminar el tipo de pago.
 */
export const DeleteTipoPago = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'El campo id es requerido' });
    }
    try {
        await executeQuery('EXEC SPTipoPagosDelete @Id', [{ name: 'Id', type: sql.Int, value: parseInt(id) }]);
        res.status(200).json({ msg: 'Tipo de pago eliminado correctamente' });
    } catch (error) {
        console.error(`Error al eliminar el tipo de pago: ${error}`);
        res.status(500).json({ msg: 'Error al eliminar el tipo de pago' });
    }
};
