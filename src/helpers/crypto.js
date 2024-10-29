import crypto from 'crypto';

export function encryptPassword(password) {
    const algorithm = 'aes-256-ctr';
    const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'; // Generar y almacenar esta clave de manera segura
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
