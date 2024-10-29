import mssql from 'mssql';
import { executeQuery } from '../helpers/dbHelper';
import sql from 'mssql';

export const GetGrupos = async (req, res) => {
    try {
        const result = await executeQuery(`EXEC SPTraerTodosLosGrupos`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(`Error al obtener los grupos ${error}`);
        res.status(500).json({ msg: `Error al obtener los grupos` });
    }
}

export const getGrupoID = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await executeQuery('EXEC SPTraerGrupoPorID @Id', [{ name: 'Id', type: sql.Int, value: id }]);
        if (result.recordset.length > 0) 
            res.status(200).json(result.recordset[0]);
        else 
            res.status(404).json({ msg: 'Grupo no encontrado' });
        
    } catch (error) {
        console.error(`Error al obtener el grupo: ${error}`);
        res.status(500).json({ msg: 'Error al obtener el grupo' });
    }
}