export type IssueType = {
  id: number,
  issue: string,
  subIssues?: Array<{
    id: number,
    issue: string,
  }>,
};

export type Props = {
  data: Array<IssueType>,
  onIssueItemPressed: (issue: IssueType) => void,
  isSubIssueView: boolean,
  checkedIssueId: number,
  showTextBox: boolean,
};

export type IssueTypeRowProp = {
  item: IssueType,
};
