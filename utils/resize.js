'use strict';
const sharp = require('sharp');

const makePost = async (file, postname) => {
  console.log('makepost ', file, postname);
  return await sharp(file).resize(1000, 1000).toFile('thumbnails/' + postname);
};

module.exports = {
  makePost,
};