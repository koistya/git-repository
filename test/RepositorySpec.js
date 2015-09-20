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

  const repoName = 'test-repo1';

  beforeEach(async () => {
    await del(repoName);
    await fs.mkdir(resolve(__dirname, `../${repoName}`));
  });

  it(`Check if the specified path exists`, () => {
    return expect(Repository.open('dummy'))
      .be.rejectedWith(Error, `The directory '${resolve(__dirname, '../dummy')}' does not exist.`);
  });

  it(`Should throw an exception if Git repository does not exist`, () => {
    return expect(Repository.open(repoName))
      .be.rejectedWith(Error, `Cannot find a Git repository in '${resolve(__dirname, `../${repoName}`)}'.`);
  });

  it(`Should create a new Git repository if it does not exist`, () => {
    return expect(Repository.open(repoName, { init: true }))
      .eventually.be.instanceOf(Repository);
  });

});

describe('Repository#setRemote(name, url)', () => {

  let repo;
  let repoName = 'test-repo2';

  beforeEach(async () => {
    let repoPath = resolve(__dirname, `../${repoName}`);
    let gitPath = resolve(__dirname, `../${repoName}/.git`);

    if (await fs.exists(repoPath)) {
      await del(gitPath);
    } else {
      await fs.mkdir(repoPath);
    }

    repo = await Repository.open(repoName, { init: true });
  });

  it(`Should set a remote URL`, async () => {
    await repo.setRemote('test', 'https://github.com/test/test.git');
  });

  it(`Should check if a remote ref exists`, async () => {
    const result1 = await repo.hasRef('https://github.com/koistya/git-repository.git', 'master');
    const result2 = await repo.hasRef('https://github.com/koistya/git-repository.git', 'dummy');
    expect(result1).to.be.true;
    expect(result2).to.be.false;
  });

});
