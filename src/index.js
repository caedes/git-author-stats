#! /usr/bin/env node

import { bold, green, red } from 'chalk';
import console from 'console';

import gitAuthorStats from './git-author-stats';

gitAuthorStats().forEach((gitAuthorStat) => {
  const {
    author,
    commits,
    added,
    removed,
  } = gitAuthorStat;

  const gitAuthorText = [
    `${commits} commits`,
    green(`${added} ++`),
    red(`${removed} --`),
  ].join(' / ');

  console.log(`${bold(author)}: ${gitAuthorText}`);
});
