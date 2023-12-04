require('dotenv').config();
const winston = require('winston');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const {createCanvas} = require('canvas');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'logger/debug.log',
    }),
  ],
});

const saltRounds = 10;
const HasPass = (pass) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function(saltError, salt) {
      if (saltError) {
        reject(saltError);
      } else {
        bcrypt.hash(pass, salt, function(hashError, hash) {
          if (hashError) {
            reject(hashError);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
};

const emailName = (email) => {
  const nameMatch = email.split(/(?<=^.+)@(?=[^@]+$)/)[0];

  const name = nameMatch;
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

  let initials = [...name.matchAll(rgx)] || [];
  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();

  return initials;
};

const generateImage = (email) => {
  const name = emailName(email);

  const WIDTH = 250;
  const HEIGHT = 250;

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#4f368b';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#f2f2f2';
  ctx.font = '100px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`${name}`, 110, 150);
  // ctx.fillText(`${name}`, 50, 150);

  const buffer = canvas.toBuffer('image/png');
  const date = Date.now();
  fs.writeFileSync(`uploads/${date}_image_${name}.png`, buffer);
  imagePath = `${process.env.IMAGE_PATH}/uploads/${date}_image_${name}.png`;
  return imagePath;
};

module.exports = {HasPass, logger, generateImage};
