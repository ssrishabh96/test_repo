export type Props = {
  +item: {
    id: number,
    issue: string,
    subIssues?: Array<{
      id: number,
      issue: string,
    }>,
  },
  +checked: boolean,
  +isSubIssueView?: boolean,
};
