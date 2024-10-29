import { executeQuery } from '../helpers/dbHelper'
import sql from 'mssql';

// Método para obtener un mes por su nombre
export const GetMesPorNombre = async (req, res) => {
    const { nombre } = req.params;
    try {
        const result = await executeQuery('EXEC SPObtenerMesPorNombre @Nombre', [{ name: 'Nombre', type: sql.VarChar(50), value: nombre }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).json({ msg: 'Mes no encontrado' });
        }
    } catch (error) {
        console.error(`Error al obtener el mes: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el mes' });
    }
};

//para obtener todos los meses
export const GetMeses = async (req, res) => {
    try {
        const result = await executeQuery('EXEC SPObtenerMeses');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los meses: ${error}`);
        res.status(500).json({ msg: 'Error al obtener los meses' });
    }
};
export const BuscarMesPorTexto = async (req, res) => {
    const { textoBusqueda } = req.body;
    try {
        const result = await executeQuery('EXEC SPBuscarMesPorTexto @TextoBusqueda', [{ name: 'TextoBusqueda', type: sql.VarChar(50), value: textoBusqueda }]);
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(404).json({ msg: 'No se encontraron meses con el texto de búsqueda proporcionado' });
        }
    } catch (error) {
        console.error(`Error al buscar meses por texto: ${error}`);
        res.status(500).json({ msg: 'Error al buscar meses por texto' });
    }
};