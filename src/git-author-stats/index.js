import orderBy from 'lodash/orderBy';

import authors from './authors';
import commitStats from './commit-stats';
import lineStats from './line-stats';

export default () => {
  const stats = authors().map((author) => {
    const commits = parseInt(commitStats()[author], 10) || 0;

    const {
      added,
      removed,
    } = lineStats(author);

    return {
      author,
      commits,
      added,
      removed,
    };
  });

  return orderBy(stats, ['added', 'removed'], ['desc', 'desc']);
};
