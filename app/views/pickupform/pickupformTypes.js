export type ReferenceCodes = {
  [string]: Array<{ [string]: string }>,
};
export type Step = {
  id?: number,
  field: string,
  section?: string,
  required: boolean | string,
  editable: boolean | string,
  readable: boolean | string,
  showWarning: boolean,
  label: string,
  value: string,
  type: string,
  key1: string,
  optionKeys?: string,
  referenceDataKey?: string,
};

export type DataSource = Array<{
  key: string,
  data: Step[],
}>;
