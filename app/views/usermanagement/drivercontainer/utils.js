// @flow

export const getPcardMessage = (action: ?string) => {
  switch (action) {
    // TODO: Capitalize pcard action texts
    case 'destroy':
      return 'Pcard destroyed succesfully!';
    case 'status':
      return 'Pcard status changed succesfully!';
    case 'request':
      return 'Pcard requested!';
    default:
      return 'Pcard updated succesfully!';
  }
};
