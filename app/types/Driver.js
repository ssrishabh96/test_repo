// @flow

export type DriverStatus = 'A' | 'I';

export type PcardStatus = 'A' | 'I' | 'P' | 'O' | 'W' | 'D';

export type Driver = {|
  status: DriverStatus,
  createDate: Date,
  lastUpdateDate: Date,
  createUser: string,
  lastUpdateUser: string,
  sourceSystem: 'CAS',
  vendorPersonnelId: number,
  pcard?: {
    status: PcardStatus,
    createDate: Date,
    lastUpdateDate: Date,
    createUser: string,
    lastUpdateUser: string,
    sourceSystem: string,
    correlationId: number,
    vendorPersonnelId: number,
    cardNumber: string,
    securityCode: ?number,
    abaBnkNumber: string,
    bankAccountNumber: number,
    startDate: Date,
    endDate: Date,
    cancelDate: Date,
    comments: ?string,
    pcardType: 'S', // TODO: What other types ?
    pcardCASNumber: number,
    pcardId: number,
  },
  vendorId: number,
  roleId: 3,
  pcardFlg: 'Y' | 'N',
  dispatchableFlag: boolean,
  firstName: string,
  middleName?: string,
  lastName: string,
  dateOfBirth: Date,
  isCopartEmp: boolean,
  startDate: Date,
  endDate: Date,
  comments: null,
  phoneNum: number,
  phoneExt: number,
  email: string,
  shortName: string,
  role: 'DRIVER',
|};
