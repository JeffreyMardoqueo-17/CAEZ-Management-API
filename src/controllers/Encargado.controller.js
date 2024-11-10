import { executeQuery } from '../helpers/dbHelper';
import sql from '../DataBase/contection/Conexion';

const EncargadoController = {
    // Obtener todos los encargados
    async getEncargados(req, res) {
        try {
            const result = await executeQuery('EXEC SPEncargadoGetAll');
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener los encargados: ${error}`);
            res.status(500).json({ msg: 'Error al obtener los encargados' });
        }
    },

    // Obtener un encargado por su Id
    async getEncargadoById(req, res) {
        const { id } = req.params;
        try {
            const result = await executeQuery('EXEC SPEncargadoGetById @Id', [
                { name: 'Id', type: sql.Int, value: id }
            ]);
            result.recordset.length > 0
                ? res.status(200).json(result.recordset[0])
                : res.status(404).json({ msg: 'Encargado no encontrado' });
        } catch (error) {
            console.error(`Error al obtener el encargado: ${error}`);
            res.status(500).json({ msg: 'Error al obtener el encargado' });
        }
    },

    // Crear un nuevo encargado
    async createEncargado(req, res) {
        const { Nombre, Apellido, Telefono, Correo, IdDireccion, IdRole, IdParentezco, IdTipoDocumento, NumDocumento } = req.body;

        if (!Nombre || !Apellido || !Telefono || !Correo || !IdDireccion || !IdRole || !IdParentezco || !IdTipoDocumento || !NumDocumento) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        try {
            // Verificar duplicados antes de crear un nuevo encargado
            const duplicateCheck = await executeQuery(
                'SELECT Id FROM Encargado WHERE Telefono = @Telefono OR Correo = @Correo OR NumDocumento = @NumDocumento',
                [
                    { name: 'Telefono', type: sql.NVarChar(15), value: Telefono },
                    { name: 'Correo', type: sql.NVarChar(50), value: Correo },
                    { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento }
                ]
            );

            if (duplicateCheck.recordset.length > 0) {
                return res.status(400).json({ msg: 'Ya existe un encargado con el mismo teléfono, correo o número de documento' });
            }

            // Obtener el Id del administrador (usuario logueado) del token
            const IdAdministrador = req.user.id; // Asumiendo que validateToken añade req.user con los datos del usuario

            const result = await executeQuery(
                'EXEC SPEncargadoCreate @Nombre, @Apellido, @Telefono, @Correo, @IdDireccion, @IdRole, @IdParentezco, @IdTipoDocumento, @NumDocumento, @IdAdministrador',
                [
                    { name: 'Nombre', type: sql.NVarChar(50), value: Nombre },
                    { name: 'Apellido', type: sql.NVarChar(50), value: Apellido },
                    { name: 'Telefono', type: sql.NVarChar(15), value: Telefono },
                    { name: 'Correo', type: sql.NVarChar(50), value: Correo },
                    { name: 'IdDireccion', type: sql.Int, value: IdDireccion },
                    { name: 'IdRole', type: sql.Int, value: IdRole },
                    { name: 'IdParentezco', type: sql.Int, value: IdParentezco },
                    { name: 'IdTipoDocumento', type: sql.Int, value: IdTipoDocumento },
                    { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento },
                    { name: 'IdAdministrador', type: sql.Int, value: IdAdministrador }
                ]
            );
            res.status(201).json({ msg: 'Encargado creado exitosamente', encargadoId: result.recordset[0].Id });
        } catch (error) {
            console.error(`Error al crear el encargado: ${error}`);
            res.status(500).json({ msg: 'Error al crear el encargado', error: error.message });
        }
    },

    // Actualizar un encargado
    async updateEncargado(req, res) {
        const { id } = req.params;
        const { Nombre, Apellido, Telefono, Correo, IdDireccion, IdRole, IdParentezco, IdTipoDocumento, NumDocumento } = req.body;

        if (!Nombre || !Apellido || !Telefono || !Correo || !IdDireccion || !IdRole || !IdParentezco || !IdTipoDocumento || !NumDocumento) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        try {
            // Verificación de duplicados
            const duplicateCheck = await executeQuery(
                'SELECT Id FROM Encargado WHERE (Telefono = @Telefono OR Correo = @Correo OR NumDocumento = @NumDocumento) AND Id <> @Id',
                [
                    { name: 'Telefono', type: sql.NVarChar(15), value: Telefono },
                    { name: 'Correo', type: sql.NVarChar(50), value: Correo },
                    { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento },
                    { name: 'Id', type: sql.Int, value: id }
                ]
            );

            console.log("Resultado de verificación de duplicados:", duplicateCheck.recordset); // Agregar log para depuración

            if (duplicateCheck.recordset.length > 0) {
                return res.status(400).json({ msg: 'Ya existe otro encargado con el mismo teléfono, correo o número de documento' });
            }

            // Obtener el Id del administrador (usuario logueado) del token
            const IdAdministrador = req.user.id;

            // Actualizar el registro
            const result = await executeQuery(
                'EXEC SPEncargadoUpdate @Id, @Nombre, @Apellido, @Telefono, @Correo, @IdDireccion, @IdRole, @IdParentezco, @IdTipoDocumento, @NumDocumento, @IdAdministrador',
                [
                    { name: 'Id', type: sql.Int, value: id },
                    { name: 'Nombre', type: sql.NVarChar(50), value: Nombre },
                    { name: 'Apellido', type: sql.NVarChar(50), value: Apellido },
                    { name: 'Telefono', type: sql.NVarChar(15), value: Telefono },
                    { name: 'Correo', type: sql.NVarChar(50), value: Correo },
                    { name: 'IdDireccion', type: sql.Int, value: IdDireccion },
                    { name: 'IdRole', type: sql.Int, value: IdRole },
                    { name: 'IdParentezco', type: sql.Int, value: IdParentezco },
                    { name: 'IdTipoDocumento', type: sql.Int, value: IdTipoDocumento },
                    { name: 'NumDocumento', type: sql.NVarChar(50), value: NumDocumento },
                    { name: 'IdAdministrador', type: sql.Int, value: IdAdministrador }
                ]
            );

            res.status(200).json({ msg: 'Encargado actualizado exitosamente' });
        } catch (error) {
            console.error(`Error al actualizar el encargado: ${error}`);
            res.status(500).json({ msg: 'Error al actualizar el encargado' });
        }
    },
    // Eliminar un encargado
    async deleteEncargado(req, res) {
        const { id } = req.params;
        try {
            await executeQuery('EXEC SPEncargadoDelete @Id', [
                { name: 'Id', type: sql.Int, value: id }
            ]);
            res.status(200).json({ msg: 'Encargado eliminado exitosamente' });
        } catch (error) {
            console.error(`Error al eliminar el encargado: ${error}`);
            res.status(500).json({ msg: 'Error al eliminar el encargado' });
        }
    }
};

export default EncargadoController;
