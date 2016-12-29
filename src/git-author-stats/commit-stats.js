import compact from 'lodash/compact';
import fromPairs from 'lodash/fromPairs';
import reverse from 'lodash/reverse';

import command from '../lib/command';

export default () => {
  const commitsCommandResult = command('git shortlog -s -n --all --no-merges');
  const commitStats = compact(commitsCommandResult.split('\n'));

  const commitStatsPerAuthors = fromPairs(commitStats.map(commitStat => (
    reverse(commitStat.split('\t'))
  )));

  return commitStatsPerAuthors;
};
