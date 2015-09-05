/**
 * Copyright © 2015 Konstantin Tarkus.  All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import { resolve } from 'path';
import del from 'del';
import fs from '../src/utils/fs';
import Repository from '../src/Repository';

chai.use(require('chai-as-promised'));

describe('Repository.open(path, options)', () => {

  beforeEach(done => {
    del('test-repo', () => fs.mkdir(resolve(__dirname, '../test-repo')).then(done, done));
  });

  it(`Check if the specified path exists`, () => {
    return expect(Repository.open('dummy'))
      .be.rejectedWith(Error, `The directory '${resolve(__dirname, '../dummy')}' does not exist.`);
  });

  it(`Should throw an exception if Git repository does not exist`, () => {
    return expect(Repository.open('test-repo'))
      .be.rejectedWith(Error, `Cannot find a Git repository in '${resolve(__dirname, '../test-repo')}'.`);
  });

  it(`Should create a new Git repository if it does not exist`, () => {
    return expect(Repository.open('test-repo', { init: true }))
      .eventually.be.instanceOf(Repository);
  });

});
