import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

export const encrypt = (text,password) => {
    return AES.encrypt(text, password).toString();
}

export const decrypt = (text,password) => {
    const bytes = AES.decrypt(text, password);
    return bytes.toString(Utf8);
}