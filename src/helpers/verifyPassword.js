import crypto from 'crypto';

/**
 * Verifica si la contraseña ingresada coincide con la contraseña almacenada (encriptada).
 * 
 * @param {string} password - La contraseña ingresada por el usuario que se desea verificar.
 * @param {string} encryptedPassword - La contraseña almacenada encriptada en la base de datos.
 * @returns {boolean} - Devuelve `true` si la contraseña es correcta, `false` en caso contrario.
 */
export function verifyPassword(password, encryptedPassword) {
    // Divide la contraseña encriptada en el vector de inicialización (IV) y el texto encriptado.
    const [iv, encrypted] = encryptedPassword.split(':');

    // Define el algoritmo de cifrado utilizado y la clave secreta para el desciframiento.
    const algorithm = 'aes-256-ctr';
    const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; // Esta clave debe ser almacenada de forma segura.

    // Crea un descifrador utilizando el algoritmo, la clave secreta y el vector de inicialización.
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(iv, 'hex'));

    // Descifra el texto encriptado y concatena los fragmentos para obtener el texto original.
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);

    // Compara la contraseña ingresada con la contraseña descifrada. Retorna `true` si coinciden.
    if (decrypted.toString() === password) {
        console.log("Contraseña verificada correctamente. Usuario logueado.");
        return true;
    } else {
        console.log("Contraseña incorrecta. Verificación fallida.");
        return false;
    }
}
