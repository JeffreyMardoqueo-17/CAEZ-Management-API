import jwt from 'jsonwebtoken';
import { executeQuery } from '../helpers/dbHelper';
import sql from '../DataBase/contection/Conexion';
import { verifyPassword } from '../helpers/verifyPassword';
import { generateAndStoreToken } from '../helpers/GenerarToken';

const UserController = {
    async getUsers(req, res) {
        try {
            const result = await executeQuery('EXEC SPUserGet');
            res.status(200).json(result.recordset);
        } catch (error) {
            console.error(`Error al obtener los usuarios: ${error}`);
            res.status(500).json({ msg: 'Error al obtener los usuarios' });
        }
    },

    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const result = await executeQuery('EXEC SPUserGetById @Id', [{ name: 'Id', type: sql.Int, value: id }]);
            result.recordset.length > 0
                ? res.status(200).json(result.recordset[0])
                : res.status(404).json({ msg: 'Usuario no encontrado' });
        } catch (error) {
            console.error(`Error al obtener el usuario: ${error}`);
            res.status(500).json({ msg: 'Error al obtener el usuario' });
        }
    },

    async createUser(req, res) {
        const { Name, LastName, Login, Password, IdRole } = req.body;

        if (!Name || !LastName || !Login || !Password || !IdRole) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        try {
            const hashedPassword = await encryptPassword(Password);
            const Status = 1;

            const result = await executeQuery(
                'EXEC SPUserCreate @Name, @LastName, @Login, @Password, @Status, @IdRole',
                [
                    { name: 'Name', type: sql.NVarChar(30), value: Name },
                    { name: 'LastName', type: sql.NVarChar(30), value: LastName },
                    { name: 'Login', type: sql.NVarChar(100), value: Login },
                    { name: 'Password', type: sql.NVarChar(100), value: hashedPassword },
                    { name: 'Status', type: sql.TinyInt, value: Status },
                    { name: 'IdRole', type: sql.Int, value: IdRole },
                ]
            );
            res.status(201).json({ msg: 'Usuario creado exitosamente', userId: result.recordset[0].Id });
        } catch (error) {
            console.error(`Error al crear el usuario: ${error}`);
            res.status(500).json({ msg: 'Error al crear el usuario', error: error.message });
        }
    },

    async updateUser(req, res) {
        const { id } = req.params;
        const { Name, LastName, Login, Password, Status, IdRole } = req.body;

        if (!Name || !LastName || !Login || !Status || !IdRole) {
            return res.status(400).json({ msg: 'Todos los campos son requeridos' });
        }

        try {
            const hashedPassword = Password ? await encryptPassword(Password) : null;

            const query = `EXEC SPUserUpdate @Id, @Name, @LastName, @Login, ${hashedPassword ? '@Password,' : ''} @Status, @IdRole`;
            const params = [
                { name: 'Id', type: sql.Int, value: id },
                { name: 'Name', type: sql.NVarChar(30), value: Name },
                { name: 'LastName', type: sql.NVarChar(30), value: LastName },
                { name: 'Login', type: sql.NVarChar(100), value: Login },
                { name: 'Status', type: sql.TinyInt, value: Status },
                { name: 'IdRole', type: sql.Int, value: IdRole },
            ];

            if (hashedPassword) {
                params.push({ name: 'Password', type: sql.NVarChar(100), value: hashedPassword });
            }

            await executeQuery(query, params);
            res.status(200).json({ msg: 'Usuario actualizado exitosamente' });
        } catch (error) {
            console.error(`Error al actualizar el usuario: ${error}`);
            res.status(500).json({ msg: 'Error al actualizar el usuario' });
        }
    },

    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await executeQuery('EXEC SPUserDelete @Id', [{ name: 'Id', type: sql.Int, value: id }]);
            res.status(200).json({ msg: 'Usuario eliminado exitosamente' });
        } catch (error) {
            console.error(`Error al eliminar el usuario: ${error}`);
            res.status(500).json({ msg: 'Error al eliminar el usuario' });
        }
    },


    /**
     * Inicia sesión de un usuario.
     * @param {Object} req - La solicitud HTTP.
     * @param {Object} res - La respuesta HTTP.
     */
    async loginUser(req, res) {
        const { Login, Password } = req.body;
        // Validaciones
        if (!Login || !Password) {
            return res.status(400).json({ msg: 'Login y Password son requeridos' });
        }
        try {
            // Ejecutar el procedimiento almacenado para obtener el usuario por login
            const user = await executeQuery('EXEC SPUserLogin @Login', [
                { name: 'Login', type: sql.NVarChar(100), value: Login }
            ]);

            // Verificar si se encontró el usuario
            if (user.recordset.length === 0) {
                return res.status(404).json({ msg: 'Usuario no encontrado o no activo' });
            }
            const userData = user.recordset[0];
            // Verificar si `Password` está disponible en los datos del usuario
            if (!userData.Password) {
                console.error("La contraseña encriptada no está disponible en userData.");
                return res.status(500).json({ msg: 'Error interno: la contraseña no se encuentra disponible.' });
            }
            // Verificar si la contraseña es correcta
            const isPasswordCorrect = verifyPassword(Password, userData.Password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ msg: 'Contraseña incorrecta' });
            }

            // Generar el token JWT
            const token = generateAndStoreToken(userData.Id);

            // Enviar la respuesta con el token y los datos del usuario
            res.status(200).json({
                msg: 'Inicio de sesión exitoso',
                token,
                user: {
                    id: userData.Id,
                    name: userData.Name,
                    lastName: userData.LastName,
                    login: userData.Login,
                    status: userData.Status,
                    registrationDate: userData.RegistrationDate,
                    role: userData.IdRole  // Puedes añadir más campos si es necesario
                }
            });
        } catch (error) {
            console.error(`Error al iniciar sesión: ${error}`);
            res.status(500).json({ msg: 'Error al iniciar sesión', error: error.message });
        }
    }
};

export default UserController;
