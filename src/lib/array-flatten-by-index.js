import compact from 'lodash/compact';

export default (array, index, integer = true) => (
  compact(array.map(item => (
    integer ? parseInt(item[index], 10) : item[index]
  )))
);
