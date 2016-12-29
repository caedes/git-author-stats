import childProcess from 'child_process';

export default (command) => {
  const execSync = childProcess.execSync;

  const commandResult = execSync(command).toString('utf8');

  return commandResult;
};
