import arrayFlattenByIndex from '../lib/array-flatten-by-index';
import arraySum from '../lib/array-sum';
import command from '../lib/command';

export default (author) => {
  const lineStatsCommand = `git log --no-merges --author="${author}" --pretty=tformat: --numstat`;
  const lineStatsCommandResult = command(lineStatsCommand);

  const lineStats = lineStatsCommandResult.split('\n');
  const lineStatsResult = lineStats.map(lineStat => (
    lineStat.split('\t')
  ));

  const addedStatsResult = arrayFlattenByIndex(lineStatsResult, 0);
  const removedStatsResult = arrayFlattenByIndex(lineStatsResult, 1);

  const added = arraySum(addedStatsResult);
  const removed = arraySum(removedStatsResult);

  return {
    added,
    removed,
  };
};
