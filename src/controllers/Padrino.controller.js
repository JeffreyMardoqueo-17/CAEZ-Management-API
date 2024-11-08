import { executeQuery } from '../helpers/dbHelper';
import sql from '../DataBase/contection/Conexion';

const PadrinoController = {
    // Obtener todos los padrinos
    async getPadrinos(req, res) {
        try {
            const result = await executeQuery('EXEC SPPadrinoGetAll');
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener los padrinos: ${error}`);
            res.status(500).json({ msg: 'Error al obtener los padrinos' });
        }
    },

    // Obtener un padrino por su Id
    async getPadrinoById(req, res) {
        const { id } = req.params;
        try {
            const result = await executeQuery('EXEC SPPadrinoGetById @Id', [
                { name: 'Id', type: sql.Int, value: id }
            ]);
            result.recordset.length > 0
                ? res.status(200).json(result.recordset[0])
                : res.status(404).json({ msg: 'Padrino no encontrado' });
        } catch (error) {
            console.error(`Error al obtener el padrino: ${error}`);
            res.status(500).json({ msg: 'Error al obtener el padrino' });
        }
    },

    // Crear un nuevo padrino
    async createPadrino(req, res) {
        const { Nombre, Apellido, Telefono, Correo, IdRole } = req.body;

        if (!Nombre || !Apellido || !Telefono || !Correo || !IdRole) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        try {
            // Obtener el Id del administrador (usuario logueado) del token
            const IdAdministrador = req.user.id; // Asumiendo que validateToken añade req.user con los datos del usuario

            const result = await executeQuery(
                'EXEC SPPadrinoCreate @Nombre, @Apellido, @Telefono, @Correo, @IdRole, @IdAdministrador',
                [
                    { name: 'Nombre', type: sql.NVarChar(50), value: Nombre },
                    { name: 'Apellido', type: sql.NVarChar(50), value: Apellido },
                    { name: 'Telefono', type: sql.NVarChar(15), value: Telefono },
                    { name: 'Correo', type: sql.NVarChar(50), value: Correo },
                    { name: 'IdRole', type: sql.Int, value: IdRole },
                    { name: 'IdAdministrador', type: sql.Int, value: IdAdministrador }
                ]
            );
            res.status(201).json({ msg: 'Padrino creado exitosamente', padrinoId: result.recordset[0].Id });
        } catch (error) {
            console.error(`Error al crear el padrino: ${error}`);
            res.status(500).json({ msg: 'Error al crear el padrino', error: error.message });
        }
    },

    // Actualizar un padrino
    async updatePadrino(req, res) {
        const { id } = req.params;
        const { Nombre, Apellido, Telefono, Correo, IdRole } = req.body;

        if (!Nombre || !Apellido || !Telefono || !Correo || !IdRole) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        try {
            // Obtener el Id del administrador (usuario logueado) del token
            const IdAdministrador = req.user.id;

            const result = await executeQuery(
                'EXEC SPPadrinoUpdate @Id, @Nombre, @Apellido, @Telefono, @Correo, @IdRole, @IdAdministrador',
                [
                    { name: 'Id', type: sql.Int, value: id },
                    { name: 'Nombre', type: sql.NVarChar(50), value: Nombre },
                    { name: 'Apellido', type: sql.NVarChar(50), value: Apellido },
                    { name: 'Telefono', type: sql.NVarChar(15), value: Telefono },
                    { name: 'Correo', type: sql.NVarChar(50), value: Correo },
                    { name: 'IdRole', type: sql.Int, value: IdRole },
                    { name: 'IdAdministrador', type: sql.Int, value: IdAdministrador }
                ]
            );
            res.status(200).json({ msg: 'Padrino actualizado exitosamente' });
        } catch (error) {
            console.error(`Error al actualizar el padrino: ${error}`);
            res.status(500).json({ msg: 'Error al actualizar el padrino' });
        }
    },

    // Eliminar un padrino
    async deletePadrino(req, res) {
        const { id } = req.params;
        try {
            await executeQuery('EXEC SPPadrinoDelete @Id', [
                { name: 'Id', type: sql.Int, value: id }
            ]);
            res.status(200).json({ msg: 'Padrino eliminado exitosamente' });
        } catch (error) {
            console.error(`Error al eliminar el padrino: ${error}`);
            res.status(500).json({ msg: 'Error al eliminar el padrino' });
        }
    }
};

export default PadrinoController;
