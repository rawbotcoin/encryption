let rawbotgpg = require('./index');

rawbotgpg.apply_key('mygpg.key','devhassanjawhar@gmail.com');
rawbotgpg.encrypt_file('devhassanjawhar@gmail.com','data.txt')