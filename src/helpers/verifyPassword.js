import crypto from 'crypto';

/**
 * Verifica si la contraseña ingresada coincide con la contraseña almacenada (encriptada).
 * 
 * @param {string} password - La contraseña ingresada por el usuario que se desea verificar.
 * @param {string} encryptedPassword - La contraseña almacenada encriptada en la base de datos (formato iv:encrypted).
 * @returns {boolean} - Devuelve `true` si la contraseña es correcta, `false` en caso contrario.
 */
export function verifyPassword(password, encryptedPassword) {
    try {
        // Descomponer el valor de `encryptedPassword` en `iv` y `encrypted`
        const [ivHex, encrypted] = encryptedPassword.split(':');
        if (!ivHex || !encrypted) {
            console.error("Formato de contraseña encriptada no válido.");
            return false;
        }

        const algorithm = 'aes-256-ctr';
        const secretKey = process.env.ENCRYPTION_KEY;

        // Crear el decifrador con el iv y la clave
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(ivHex, 'hex'));

        // Desencriptar y comparar con la contraseña ingresada
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
        return decrypted.toString() === password;
    } catch (error) {
        console.error("Error al verificar la contraseña:", error);
        return false;
    }
}
