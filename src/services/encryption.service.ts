import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as config from 'config';
const jwtConfig = config.get('jwt');
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc'; // Encryption algorithm
  private readonly key = process.env.SECRETCRYPTO  // 32 bytes key (for aes-256-cbc)
  private readonly ivLength = 16; // AES block size for IV

  // Encrypt method: Encrypts plain text to encrypted string
  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(this.ivLength); // Generate a random IV
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Return IV + Encrypted text
  }

  // Decrypt method: Decrypts encrypted string back to plain text
  decrypt(encryptedText: string): string {
    const [ivHex, encryptedData] = encryptedText.split(':'); // Split IV and encrypted data
    const iv = Buffer.from(ivHex, 'hex'); // Convert IV from hex to Buffer
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted; // Return decrypted text
  }
}
