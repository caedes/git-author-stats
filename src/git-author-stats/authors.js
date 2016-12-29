import childProcess from 'child_process';
import compact from 'lodash/compact';

export default () => {
  const execSync = childProcess.execSync;

  const authorsCommand = "git log --format='%aN' | sort -u";
  const authorsCommandResult = execSync(authorsCommand).toString('utf8');
  const authors = compact(authorsCommandResult.split('\n'));

  return authors;
};
