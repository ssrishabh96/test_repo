// @flow

export type FormValues = {
  chargesAskedByLocation: string | number,
  chargesBreakdown: Array<{
    id: number,
    chargeReason: string,
    chargeValue: string | number,
  }>,
};

export type FormViewProps = {
  chargesDue: string | number,
  currentSelectedCharge: string,
  currentChargeValue: string | number,
  chargesAskedByLocation: string | number,
  chargesBreakdown: Array<{
    id: number,
    issue: string,
    chargeValue: string | number,
  }>,
  error?: {
    message: string,
  },
  onSubmit: (values: Object) => any,
  onChangeChargesAskedByLocation: (text: string) => any,
  onPressSelectChargeType: () => any,
  onChangeCurrentChargeValue: (text: string) => any,
  onChargeRemove: (chargeId: number | string) => void,
};

export type ContainerProps = {};

export type ChargeBreakDownItem = {
  index: number,
  chargeType: string,
  chargeValue: string,
};

export type ContainerState = {
  currentChargeType: string,
  currentChargeValue: string | number,
  chargesAskedByLocation: string | number,
  differenceBreakdown: Array<ChargeBreakDownItem>,
  showChargesDueBreakdown: boolean,
  comment: string,
  error: {
    message: ?string,
  },
};

export type BreakdownItemType = {
  index: number,
  chargeType: string,
  chargeValue: string,
};
