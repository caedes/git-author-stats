import compact from 'lodash/compact';

import command from '../lib/command';

export default () => {
  const authorsCommandResult = command("git log --format='%aN' | sort -u");
  const authors = compact(authorsCommandResult.split('\n'));

  return authors;
};
