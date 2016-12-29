#! /usr/bin/env node
'use strict';

var childProcess = require('child_process');
var compact = require('lodash/compact');
var console = require('console');
var chalk = require('chalk');
var fromPairs = require('lodash/fromPairs');
var reduce = require('lodash/reduce');
var reverse = require('lodash/reverse');
var orderBy = require('lodash/orderBy');

var execSync = childProcess.execSync;

var commitsCommand = 'git shortlog -s -n --all --no-merges';
var commitsCommandResult = execSync(commitsCommand).toString('utf8');
var commitStats = compact(commitsCommandResult.split('\n'));

var commitStatsPerAuthors = fromPairs(commitStats.map(function (stat) {
  return reverse(stat.split('\t'));
}));

var authorsCommand = "git log --format='%aN' | sort -u";
var authorsCommandResult = execSync(authorsCommand).toString('utf8');
var authors = compact(authorsCommandResult.split('\n'));

var stats = authors.map(function (author) {
  var commits = parseInt(commitStatsPerAuthors[author], 10) || 0;

  var lineStatsCommand = 'git log --no-merges --author="' + author + '" --pretty=tformat: --numstat';
  var lineStatsCommandResult = execSync(lineStatsCommand).toString('utf8');
  var lineStats = lineStatsCommandResult.split('\n');
  var lineStatsResult = lineStats.map(function (lineStat) {
    return lineStat.split('\t');
  });
  var addedStatsResult = compact(lineStatsResult.map(function (lineStatResult) {
    return parseInt(lineStatResult[0], 10);
  }));
  var removedStatsResult = compact(lineStatsResult.map(function (lineStatResult) {
    return parseInt(lineStatResult[1], 10);
  }));

  var added = reduce(addedStatsResult, function (a, b) {
    return a + b;
  }, 0);
  var removed = reduce(removedStatsResult, function (a, b) {
    return a + b;
  }, 0);

  return {
    author: author,
    commits: commits,
    added: added,
    removed: removed
  };
});

var orderedStats = orderBy(stats, ['added', 'removed'], ['desc', 'desc']);

orderedStats.forEach(function (stat) {
  var author = chalk.bold(stat.author);
  var commits = stat.commits + ' commits';
  var added = chalk.green(stat.added + ' ++');
  var removed = chalk.red(stat.removed + ' --');

  var authorStats = [commits, added, removed].join(' / ');

  console.log(author + ': ' + authorStats);
});
