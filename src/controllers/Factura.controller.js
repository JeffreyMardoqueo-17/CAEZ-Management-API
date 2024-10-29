import { GetConnection } from '../DataBase/contection/Conexion';
import sql from 'mssql';

// Método para obtener todas las facturas
export const GetFacturas = async (req, res) => {
    try {
        const pool = await GetConnection();
        const result = await pool.request().query('EXEC SPObtenerFacturas');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener las facturas: ${error}`);
        res.status(500).json({ msg: 'Error al obtener las facturas' });
    }
};

// Método para obtener una factura por su Id
export const GetFacturaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await GetConnection();
        const result = await pool.request().input('Id', sql.INT, id).query('EXEC SPObtenerFacturaPorId @Id');
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Factura no encontrada' });
        }
    } catch (error) {
        console.error(`Error al obtener la factura: ${error}`);
        res.status(500).json({ msg: 'Error al obtener la factura' });
    }
};

// Método para insertar una nueva factura
export const PostFactura = async (req, res) => {
    const { numeroFactura, idPago, fechaDescarga } = req.body;
    try {
        const pool = await GetConnection();
        await pool.request()
            .input('NumeroFactura', sql.INT, numeroFactura)
            .input('IdPago', sql.INT, idPago)
            .input('FechaDescarga', sql.DATETIME, fechaDescarga)
            .query('EXEC SPInsertarFactura @NumeroFactura, @IdPago, @FechaDescarga');
        res.status(201).json({ msg: 'Factura creada correctamente' });
    } catch (error) {
        console.error(`Error al insertar la factura: ${error}`);
        res.status(500).json({ msg: 'Error al insertar la factura' });
    }
};
