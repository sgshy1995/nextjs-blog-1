import crypto from 'crypto';
import {stringToUint8Array, Uint8ArrayToString} from './bufferSwitchString';

/**
 * 解密
 * @param password 传入的需要加密的密码
 * @param key 加密/解密key
 * @return secret 加密后的密码
 * @return secretTag 加密认证
 * */
export function frontCreateCipher(password: string, key: string) {
    const cipher = crypto.createCipher("aes-256-gcm", key);
    const cipherIn = cipher.update(password, 'utf8', 'hex');
    const secret = cipherIn + cipher.final("hex");
    const secretTag = Uint8ArrayToString(cipher.getAuthTag());
    return {secret, secretTag};
}

/**
 * 解密
 * @param password 传入的已加密密码
 * @param key 加密/解密key
 * @param auth 加密认证
 * @return passwordOut 解密后的密码
 * */
export function frontCreateDecipher(password: string, key: string, auth: string) {
    const decipherP = crypto.createDecipher("aes-256-gcm", key);
    decipherP.setAuthTag(stringToUint8Array(auth));
    const decipherPIn = decipherP.update(password, "hex", "utf8");
    const passwordOut = decipherPIn + decipherP.final("utf8");
    return {passwordOut};
}
