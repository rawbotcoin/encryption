let rawbotpgp = new (require('../index'));
var kbpgp = require('kbpgp');
var F = kbpgp["const"].openpgp;
let fs = require('fs');

let message = 'Hello people of Tomorrowland!';
let passphare = 'hassan123';

var opts = {
    userid: "User McTester (Born 1979) <user@example.com>",
    primary: {
        nbits: 4096,
        flags: F.certify_keys | F.sign_data | F.auth | F.encrypt_comm | F.encrypt_storage,
        expire_in: 0  // never expire
    },
    subkeys: [
        {
            nbits: 2048,
            flags: F.sign_data,
            expire_in: 86400 * 365 * 8 // 8 years
        }, {
            nbits: 2048,
            flags: F.encrypt_comm | F.encrypt_storage,
            expire_in: 86400 * 365 * 8
        }
    ]
};


async function doTasks() {
    let keys = await rawbotpgp.generateKeys(opts, passphare);
    fs.writeFileSync('./pgp_private', keys.pgp_private);
    fs.writeFileSync('./pgp_public', keys.pgp_public);
    let encrypted = await rawbotpgp.encrypt(fs.readFileSync('./pgp_public'), message);
    fs.writeFileSync('./encrypted', encrypted.result_string);
    let decrypted = await rawbotpgp.decrypt(fs.readFileSync('./pgp_private'), passphare, fs.readFileSync('./encrypted'));
    console.log(decrypted)
}

doTasks();