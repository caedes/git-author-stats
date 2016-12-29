#! /usr/bin/env node

import chalk from 'chalk';
import console from 'console';

import gitAuthorStats from './git-author-stats';

gitAuthorStats().forEach((gitAuthorStat) => {
  const author = chalk.bold(gitAuthorStat.author);
  const commits = `${gitAuthorStat.commits} commits`;
  const added = chalk.green(`${gitAuthorStat.added} ++`);
  const removed = chalk.red(`${gitAuthorStat.removed} --`);

  const authorStats = [commits, added, removed].join(' / ');

  console.log(`${author}: ${authorStats}`);
});
