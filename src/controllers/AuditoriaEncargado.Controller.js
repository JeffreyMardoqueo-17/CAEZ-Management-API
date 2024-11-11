import { executeQuery } from '../helpers/dbHelper';
import sql from '../DataBase/contection/Conexion';

const AuditoriaEncargadoController = {
    // Obtener todos los registros de auditoría
    async getAllAuditoria(req, res) {
        try {
            const result = await executeQuery('EXEC SPAuditoriaEncargadoGetAll');
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener la auditoría de encargados: ${error}`);
            res.status(500).json({ msg: 'Error al obtener la auditoría de encargados' });
        }
    },

    // Obtener registros de auditoría por rango de fechas
    async getAuditoriaByDateRange(req, res) {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ msg: 'Los parámetros startDate y endDate son requeridos' });
        }

        try {
            const result = await executeQuery(
                'EXEC SPAuditoriaEncargadoGetByDateRange @StartDate, @EndDate',
                [
                    { name: 'StartDate', type: sql.DateTime, value: new Date(startDate) },
                    { name: 'EndDate', type: sql.DateTime, value: new Date(endDate) }
                ]
            );
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener la auditoría de encargados en el rango de fechas: ${error}`);
            res.status(500).json({ msg: 'Error al obtener la auditoría en el rango de fechas' });
        }
    }
};

export default AuditoriaEncargadoController;
