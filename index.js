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

const authors = [
  {
    names: [
      'caedes',
      'Romain Laurent',
    ],
  },
  {
    names: [
      'maxime.degenne',
      'CDBDX\\maxime.degenne',
      'Maxime Degenne',
      'U-CDBDX\\maxime.degenne',
    ],
  },
  {
    names: [
      'Pierre Nedelec',
    ],
  },
  {
    names: [
      'pascal.maria',
      'Pascal Maria',
    ],
  },
  {
    names: [
      'Adrien Fillon',
    ],
  },
];

const stats = authors.map((author) => {
  const authorStats = author.names.map((name) => {
    const commits = parseInt(commitStatsPerAuthors[name], 10) || 0;

    const lineStatsCommand = `git log --no-merges --author="${name}" --pretty=tformat: --numstat`;
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
      commits,
      added,
      removed,
    };
  });

  const commits = reduce(authorStats.map(stat => stat.commits), (a, b) => (a + b), 0);
  const added = reduce(authorStats.map(stat => stat.added), (a, b) => (a + b), 0);
  const removed = reduce(authorStats.map(stat => stat.removed), (a, b) => (a + b), 0);

  return {
    author: author.names[0],
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
