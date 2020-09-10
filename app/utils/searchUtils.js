import {
  compose,
  prop,
  when,
  pick,
  reduce,
  merge,
  defaultTo,
  assoc,
  ifElse,
  __,
  isEmpty,
} from 'ramda';

const emptyObject = () => ({});
export const prepareSearch = ifElse(isEmpty, emptyObject, assoc('search', __, {}));

export const prepareParams = ({ params }) => {
  const { search } = compose(
    when(prop('search'), pick(['search'])),
    reduce((acc, param) => merge(acc)(defaultTo(param[1])(param[0])), {}),
  )(params);
  return {
    skip_pagination: true,
    ...(search ? { search } : {}),
  };
};
