/**
 * Copyright © 2015 Konstantin Tarkus.  All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import cp from 'child_process';

const spawn = (command, args, options) => new Promise((resolve, reject) => {
  cp.spawn(command, args, options)
    .on('error', reject)
    .on('close', resolve);
});

export default { spawn };
