type PromiseAction = Promise<any>; // TODO Add proper flow type for action creators
export type GetState = () => any; // TODO: add proper flow types for Redux-Store
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: any | ThunkAction | PromiseAction) => any;
