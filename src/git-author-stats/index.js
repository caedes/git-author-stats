import childProcess from 'child_process';
import compact from 'lodash/compact';
import fromPairs from 'lodash/fromPairs';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';
import reverse from 'lodash/reverse';

import authors from './authors';

export default () => {
  const execSync = childProcess.execSync;

  const commitsCommand = 'git shortlog -s -n --all --no-merges';
  const commitsCommandResult = execSync(commitsCommand).toString('utf8');
  const commitStats = compact(commitsCommandResult.split('\n'));

  const commitStatsPerAuthors = fromPairs(commitStats.map(stat => (
    reverse(stat.split('\t'))
  )));

  const stats = authors().map((author) => {
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

  return orderBy(stats, ['added', 'removed'], ['desc', 'desc']);
};
