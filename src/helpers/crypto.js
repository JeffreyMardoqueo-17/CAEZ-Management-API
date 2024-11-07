import crypto from 'crypto';

export const encryptPassword = (password) => {
    const algorithm = 'aes-256-ctr';
    const secretKey = process.env.ENCRYPTION_KEY;
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}
