/**
 * Copyright © 2015 Konstantin Tarkus.  All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import fs from 'fs';

function exists(path) {
  return new Promise(resolve => {
    fs.exists(path, resolve);
  });
}

function mkdir(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, err => err ? reject(err) : resolve());
  });
}

export default {
  exists,
  mkdir,
};
