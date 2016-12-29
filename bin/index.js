#! /usr/bin/env node

const childProcess = require('child_process');
const compact = require('lodash/compact');
const console = require('console');
const chalk = require('chalk');
const fromPairs = require('lodash/fromPairs');
const reduce = require('lodash/reduce');
const reverse = require('lodash/reverse');
const orderBy = require('lodash/orderBy');

const execSync = childProcess.execSync;

const commitsCommand = 'git shortlog -s -n --all --no-merges';
const commitsCommandResult = execSync(commitsCommand).toString('utf8');
const commitStats = compact(commitsCommandResult.split('\n'));

const commitStatsPerAuthors = fromPairs(commitStats.map(stat => (
  reverse(stat.split('\t'))
)));

const authorsCommand = "git log --format='%aN' | sort -u";
const authorsCommandResult = execSync(authorsCommand).toString('utf8');
const authors = compact(authorsCommandResult.split('\n'));

const stats = authors.map((author) => {
  const commits = parseInt(commitStatsPerAuthors[author], 10) || 0;

  const lineStatsCommand = `git log --no-merges --author="${author}" --pretty=tformat: --numstat`;
  const lineStatsCommandResult = execSync(lineStatsCommand).toString('utf8');
  const lineStats = lineStatsCommandResult.split('\n');
  const lineStatsResult = lineStats.map(lineStat => (
    lineStat.split('\t')
  ));
  const addedStatsResult = compact(lineStatsResult.map(lineStatResult => (
    parseInt(lineStatResult[0], 10)
  )));
  const removedStatsResult = compact(lineStatsResult.map(lineStatResult => (
    parseInt(lineStatResult[1], 10)
  )));

  const added = reduce(addedStatsResult, (a, b) => (a + b), 0);
  const removed = reduce(removedStatsResult, (a, b) => (a + b), 0);

  return {
    author,
    commits,
    added,
    removed,
  };
});

const orderedStats = orderBy(stats, ['added', 'removed'], ['desc', 'desc']);

orderedStats.forEach((stat) => {
  const author = chalk.bold(stat.author);
  const commits = `${stat.commits} commits`;
  const added = chalk.green(`${stat.added} ++`);
  const removed = chalk.red(`${stat.removed} --`);

  const authorStats = [commits, added, removed].join(' / ');

  console.log(`${author}: ${authorStats}`);
});
