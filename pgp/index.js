var kbpgp = require('kbpgp');
var ring = new kbpgp.keyring.KeyRing;
var asp = new kbpgp.ASP({});

class RawbotPGP {
    decrypt(pgp_private, pgp_passphare, pgp_msg) {
        return new Promise((resolve, reject) => {
            kbpgp.KeyManager.import_from_armored_pgp({
                armored: pgp_private
            }, function (err, account) {
                if (err) {
                    return reject(err);
                }

                account.unlock_pgp({
                    passphrase: pgp_passphare
                }, function (err) {
                    if (err) {
                        return reject(err);
                    }

                    ring.add_key_manager(account);
                    kbpgp.unbox({
                        keyfetch: ring,
                        armored: pgp_msg,
                        asp: asp
                    }, function (err, literals) {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(literals[0].toString());
                    });
                });
            });
        });
    }

    encrypt(pgp_public, message) {
        return new Promise((resolve, reject) => {
            kbpgp.KeyManager.import_from_armored_pgp({
                armored: pgp_public
            }, function (err, account) {
                if (err) {
                    return reject(err);
                }
                var params = {
                    msg: message,
                    encrypt_for: account
                };

                kbpgp.box(params, function (err, result_string, result_buffer) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({
                        result_string,
                        result_buffer
                    })
                });
            });
        });
    }

    generateKeys(opts, passphrase) {
        return new Promise((resolve, reject) => {
            kbpgp.KeyManager.generate(opts, function (err, account) {
                if (err) {
                    return reject(err);
                }
                account.sign({}, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    account.export_pgp_private({
                        passphrase: passphrase
                    }, function (err, pgp_private) {
                        if (err) {
                            return reject(err);
                        }
                        account.export_pgp_public({}, function (err, pgp_public) {
                            if (err) {
                                return reject(err);
                            }
                            return resolve({
                                pgp_private,
                                pgp_public
                            })
                        });
                    });
                });
            });
        });
    }
}

module.exports = RawbotPGP;