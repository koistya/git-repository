/**
 * Copyright © 2015 Konstantin Tarkus.  All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { join, resolve } from 'path';
import cp from './utils/cp';
import fs from './utils/fs';

class Repository {

  constructor(path) {
    this.path = path;
  }

  static async open(path, options = {}) {
    path = resolve(process.cwd(), path);
    let exists = await fs.exists(path);

    if (!exists) {
      throw new Error(`The directory '${path}' does not exist.`);
    }

    exists = await fs.exists(join(path, '.git'));

    const opts = { cwd: path, stdio: 'inherit' };

    if (!exists) {
      if (options.init === true) {
        const code = await cp.spawn('git', ['init'], opts);
        if (code !== 0) {
          throw new Error(`Failed to initialize a new Git repository in '${path}'.`);
        }
      } else {
        throw new Error(`Cannot find a Git repository in '${path}'.`);
      }
    }

    return new Repository(path);
  }

  setRemote(name, url) {
    throw new Error('Not implemented.');
  }

  add(files) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', ['add', ...(files.split(/\s+/))], opts);
  }

  commit(message) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', ['commit', '-m', message], opts);
  }

  push(remote = 'origin', branch = 'master') {
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', ['push', remote, branch], opts);
  }

}

export default Repository;
