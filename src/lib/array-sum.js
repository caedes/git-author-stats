import reduce from 'lodash/reduce';

export default (array) => {
  const sum = reduce(array, (a, b) => (a + b), 0);

  return sum;
};
