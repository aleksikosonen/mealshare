/**
 * Js-file for resize
 *
 * JS for getting a specific sized picture for displaying in feed and profile
 *
 * @author Aleksi Kosonen, Niko Lindborg & Aleksi Kytö
 *
 **/

'use strict';
const sharp = require('sharp');

//Makes a "thumbnail" from the uploaded picture which is presented on the site
const makePost = async (file, postname) => {
  console.log('makepost ', file, postname);
  return await sharp(file).resize(1000, 1000).toFile('thumbnails/' + postname);
};

module.exports = {
  makePost,
};