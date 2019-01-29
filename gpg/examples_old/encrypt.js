let rawbot_gpg = require('../index');

const file_to_encrypt = 'k.gif';
const batch_file = 'genkey-batch';
let file_encrypted;

let async = require('async');
async.series({
    one: function (parallelCb) {
        rawbot_gpg.generateKeys(batch_file)
            .then(result => {
                console.log(result)
                parallelCb(null, result);
            })
            .catch(err => {
                parallelCb(err, null);
            });
    },
    //
    // two: function (parallelCb) {
    //     rawbot_gpg.encryptFile('asdfgh', file_to_encrypt)
    //         .then(result => {
    //             file_encrypted = result;
    //             parallelCb(null, result);
    //         })
    //         .catch(err => {
    //             parallelCb(err, null);
    //         });
    // },
    //
    // three: function (parallelCb) {
    //     rawbot_gpg.decryptFile(file_encrypted, 'decrypted_' + file_to_encrypt)
    //         .then(result => {
    //             parallelCb(null, result);
    //         })
    //         .catch(err => {
    //             parallelCb(err, null);
    //         });
    // },
}, function (err, results) {
    if (err) {
        console.error(err)
    } else {
        console.log(results);
    }
});