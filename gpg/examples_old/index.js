const exec = require('child_process').exec;
var cmd = require('node-cmd');

function execute(command_line_) {
    return new Promise((resolve, reject) => {
        exec(command_line_,
            (error, stdout, stderr) => {
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                    return reject(error);
                } else {
                    return resolve({
                        stdout,
                        stderr
                    });
                }
            });
    });
}

function generateKeys(batch_file) {
    return new Promise((resolve, reject) => {
        execute('gpg --batch --gen-key ' + batch_file)
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    });
}

function encryptFile(file_path, email) {
    return new Promise((resolve, reject) => {
        execute('gpg --output ' + file_path + '.gpg --encrypt --recipient ' + email + ' ' + file_path)
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    });
}

function decryptFile(file_path, file_destination) {
    return new Promise((resolve, reject) => {
        execute('gpg --decrypt ' + file_path + ' > ' + file_destination)
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    });
}

function trustKey(email) {
    return new Promise((resolve, reject) => {
        cmd.get(
            'echo -e "5\ny\n" | gpg --command-fd 0 --edit-key ' + email + ' trust quit',
            function (err, data, stderr) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve({
                        data, stderr
                    });
                }
            });
    });
}

function importKey(file_name) {
    return new Promise((resolve, reject) => {
        execute('gpg --import ' + file_name)
            .then(result => {
                return resolve(result);
            })
            .catch(err => {
                return reject(err);
            });
    });
}


module.exports = {
    execute,
    generateKeys,
    encryptFile,
    decryptFile,
    importKey,
    trustKey
};


