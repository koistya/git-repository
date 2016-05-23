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

async function createRepoDir(repoName) {
  await del(repoName);
  await fs.mkdir(resolve(__dirname, `../${repoName}`));
};

async function checkRepo(repoName) {
  let repo;
  let repoPath = resolve(__dirname, `../${repoName}`);
  let gitPath = resolve(__dirname, `../${repoName}/.git`);

  if (await fs.exists(gitPath)) {
    return repo = await Repository.open(repoName);
  } else {
    await fs.mkdir(repoPath);
    return repo = await Repository.open(repoName, {init: true});
  }
};

describe('Repository.open(path, options)', () => {
  let repo;
  const repoName = 'test-repo1';

  beforeEach(async () => {
    repo = await createRepoDir(repoName);
  });

  after(async () => {
    await del(repoName);
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
  const repoName = 'test-repo2';

  beforeEach(async () => {
    repo = await checkRepo(repoName);
  });

  after(async () => {
    await del(repoName);
  });

  it(`Should set a remote URL`, async () => {
    await repo.setRemote('test', 'https://github.com/test/test.git');
  });

  it(`Should check if a remote ref exists`, async function() {
    this.timeout(4000);
    const result1 = await repo.hasRef('https://github.com/koistya/git-repository.git', 'master');
    const result2 = await repo.hasRef('https://github.com/koistya/git-repository.git', 'dummy');
    expect(result1).to.be.true;
    expect(result2).to.be.false;
  });

});

describe('Repository#checkout(branch)', () => {
  let repo;
  const repoName = 'test-repo3';
  const branchName = 'new-branch';
  const illegalBranchName = '..illegal';

  before(async () => {
    repo = await checkRepo(repoName)
  });

  after(async () => {
    await del(repoName);
  });

  it(`Should checkout the new branch`, async () => {
    const result = await repo.checkout(branchName, {new: true});
    expect(result).to.be.true;
  });

  it(`Should checkout to master branch`, async () => {
    const result = await repo.checkout('master');
    expect(result).to.be.true;
  });

  it(`Should throw an exception if Git branch is illegal`, function() {
    return expect(repo.checkout(illegalBranchName, {new: true}))
      .be.rejectedWith(Error, `fatal: '${illegalBranchName}' is not a valid branch name.`);
  });
});
