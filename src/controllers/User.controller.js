import jwt from 'jsonwebtoken';
import { executeQuery } from '../helpers/dbHelper';
import sql from '../DataBase/contection/Conexion';
import { verifyPassword } from '../helpers/verifyPassword';
import { generateAndStoreToken } from '../helpers/GenerarToken';
import { encryptPassword } from '../helpers/crypto';

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

        if (!Login || !Password) {
            return res.status(400).json({ msg: 'Login y Password son requeridos' });
        }

        try {
            // Consulta el usuario en la base de datos usando el SP
            const userResult = await executeQuery('EXEC SPUserLogin @Login', [
                { name: 'Login', type: sql.NVarChar(100), value: Login }
            ]);

            if (userResult.recordset.length === 0) {
                return res.status(404).json({ msg: 'Usuario no encontrado o no activo' });
            }

            const userData = userResult.recordset[0];

            // Verifica la contraseña encriptada
            const isPasswordCorrect = verifyPassword(Password, userData.Password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ msg: 'Contraseña incorrecta' });
            }

            // Verificar si ya existe una sesión activa para este usuario
            const sessionResult = await executeQuery(
                'SELECT * FROM Session WHERE UserId = @UserId AND ExpiresAt > GETDATE() AND IsActive = 1',
                [
                    { name: 'UserId', type: sql.Int, value: userData.Id }
                ]
            );

            if (sessionResult.recordset.length > 0) {
                // Si ya existe una sesión activa, devuelve el token existente
                return res.status(200).json({
                    msg: 'Ya tienes una sesión activa',
                    token: sessionResult.recordset[0].Token,
                    user: {
                        id: userData.Id,
                        name: userData.Name,
                        lastName: userData.LastName,
                        login: userData.Login,
                        status: userData.Status,
                        registrationDate: userData.RegistrationDate,
                        role: userData.IdRole
                    }
                });
            }

            // Genera un nuevo token JWT
            const token = generateAndStoreToken(userData.Id);

            // Guarda la nueva sesión en la base de datos
            await executeQuery(
                'INSERT INTO Session (UserId, Token, CreatedAt, ExpiresAt, IsActive) VALUES (@UserId, @Token, GETDATE(), DATEADD(HOUR, 6, GETDATE()), 1)',
                [
                    { name: 'UserId', type: sql.Int, value: userData.Id },
                    { name: 'Token', type: sql.NVarChar, value: token }
                ]
            );

            // Enviar respuesta JSON al frontend con el nuevo token y datos del usuario
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
                    role: userData.IdRole
                }
            });
        } catch (error) {
            console.error(`Error al iniciar sesión: ${error.message}`);
            res.status(500).json({ msg: 'Error al iniciar sesión' });
        }
    },

    async logoutUser(req, res) {
        try {
            console.log("req.user:", req.user);
            console.log("req.token:", req.token);

            if (!req.user || !req.user.id) {
                return res.status(400).json({ msg: 'No se pudo identificar el usuario para cerrar sesión' });
            }

            const userId = req.user.id;

            // Marcar la sesión como inactiva en lugar de eliminarla
            await executeQuery('UPDATE Session SET IsActive = 0 WHERE UserId = @UserId AND Token = @Token', [
                { name: 'UserId', type: sql.Int, value: userId },
                { name: 'Token', type: sql.NVarChar, value: req.token }
            ]);

            res.status(200).json({ msg: 'Sesión cerrada exitosamente' });
        } catch (error) {
            console.error(`Error al cerrar sesión: ${error}`);
            res.status(500).json({ msg: 'Error al cerrar sesión', error: error.message });
        }
    },
    // Endpoint en el backend para verificar la sesión
    async checkSession(req, res) {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "Token no proporcionado" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verificar que la sesión esté activa y no haya expirado
            const sessionResult = await executeQuery(
                'SELECT * FROM Session WHERE UserId = @UserId AND Token = @Token AND ExpiresAt > GETDATE() AND IsActive = 1',
                [
                    { name: 'UserId', type: sql.Int, value: decoded.id },
                    { name: 'Token', type: sql.NVarChar, value: token }
                ]
            );

            if (sessionResult.recordset.length === 0) {
                return res.status(401).json({ msg: "Sesión expirada o inválida" });
            }

            res.status(200).json({ msg: "Sesión válida", user: sessionResult.recordset[0] });
        } catch (error) {
            console.error("Error al verificar el token:", error.message);
            res.status(401).json({ msg: "Token inválido" });
        }
    }
};

export default UserController;
