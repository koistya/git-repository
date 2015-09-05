# [git-repository](https://www.npmjs.com/package/git-repository)

[![NPM version](http://img.shields.io/npm/v/git-repository.svg?style=flat-square)](http://www.npmjs.com/package/git-repository)
[![NPM downloads](http://img.shields.io/npm/dm/git-repository.svg?style=flat-square)](http://www.npmjs.com/package/git-repository)
[![Build status](http://img.shields.io/travis/koistya/git-repository/master.svg?style=flat-square)](https://travis-ci.org/koistya/git-repository)

> A Promise-based JavaScript wrapper library for working with Git CLI.

Join [#feedback](https://gitter.im/koistya/feedback) chat room on Gitter to stay up to date and share your feedback!

### How to Setup

```sh
$ npm install git-repository
```

### Getting Started

```js
import Repo from 'git-repository';

export default async () => {

  let repo = await Repo.open('./example', { init: true });

  await repo.setRemote('origin', 'https://github.com/user/example.git');
  await repo.add('--all .');
  await repo.commit('Commit message');
  await repo.push('origin', 'master');

};
```

### License

The MIT License © Konstantin Tarkus ([@koistya](https://twitter.com/koistya))
