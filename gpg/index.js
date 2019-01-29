const shell = require('shelljs');


let apply_key = function (pgp_key, email) {
    shell.exec(`./apply_key.sh ${pgp_key} ${email}`);
}

let encrypt_file = function (email, file) {
    shell.exec(`./encrypt_file.sh ${email} ${file}`);

}

module.exports = {
    apply_key,
    encrypt_file
}