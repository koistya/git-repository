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
    path = resolve(process.cwd(), path); // eslint-disable-line no-param-reassign
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

  async setRemote(name, url) {
    const opts = { cwd: this.path };
    const [, remote] = await cp.exec('git', ['config', '--get', `remote.${name}.url`], opts);
    opts.stdio = 'inherit';
    if (remote) {
      await cp.spawn('git', ['remote', 'set-url', name, url], opts);
    } else {
      await cp.spawn('git', ['remote', 'add', name, url], opts);
    }
  }

  async hasRef(repository, ref) {
    const opts = { cwd: this.path };
    const [code,, err] = await cp.exec('git', ['ls-remote', '--exit-code', repository, ref], opts);
    if (code === 2) {
      return false;
    } else if (code === 0) {
      return true;
    }
    throw new Error(err);
  }

  config(key, value, options = {}) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    const args = ['config', key, value];
    if (options.global) {
      args.push('--global');
    }
    return cp.spawn('git', args, opts);
  }

  add(files) {
    return this.addFiles(files);
  }

  addFiles(files) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', ['add', ...(files.split(/\s+/))], opts);
  }

  commit(message) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', ['commit', '-m', message], opts);
  }

  push(remote = 'origin', branch = 'master', options = {}) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    const args = ['push', remote, branch];
    if (options.force) {
      args.push('--force');
    }
    return cp.spawn('git', args, opts);
  }

  fetch(remote) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', ['fetch', remote], opts);
  }

  reset(target, options = {}) {
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', [
      'reset',
      ...(options.hard && ['--hard']),
      target,
    ], opts);
  }

  clean(path, options = {}) {
    if (typeof path !== 'string') {
      options = path || options; // eslint-disable-line no-param-reassign
      path = false;              // eslint-disable-line no-param-reassign
    }
    const opts = { cwd: this.path, stdio: 'inherit' };
    return cp.spawn('git', [
      'clean',
      '-d',
      ...(options.force && ['--force']),
      ...(path && [path]),
    ], opts);
  }

}

export default Repository;
