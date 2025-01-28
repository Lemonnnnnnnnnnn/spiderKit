import CryptoJS from 'crypto-js';

function v_decrypt(_0x2f61c9, _0x14dd13, _0x2bf4a2) {
    return CryptoJS['AES']['decrypt'](_0x2f61c9, _0x14dd13, {
        'iv': _0x2bf4a2
    })['toString'](CryptoJS['enc']['Utf8']);
}
export function getVideoInfo(_0x285840,bt_token) {
    var _token_key = CryptoJS['enc']['Utf8']['parse']("57A891D97E332A9D");
    var _token_iv = CryptoJS['enc']['Utf8']['parse'](bt_token);

    return v_decrypt( _0x285840, _token_key, _token_iv)
}