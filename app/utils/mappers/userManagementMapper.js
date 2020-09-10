import { map, evolve, compose } from 'ramda';
import { renameKeys } from 'utils/commonUtils';

const groupMap = {
  created_at: 'createDate',
  updated_at: 'lastUpdateDate',
  created_by: 'createUser',
  updated_by: 'lastUpdateUser',
  source_system: 'sourceSystem',
  correlation_id: 'correlationId',
  dispatch_group_id: 'dispatchGroupId',
  dispatch_group_name: 'name',
  dispatch_group_description: 'description',
  vendor_id: 'vendorId',
  dispatchable_flag: 'dispatchableFlag',
};

const personnelMap = {
  created_at: 'createDate',
  updated_at: 'lastUpdateDate',
  created_by: 'createUser',
  updated_by: 'lastUpdateUser',
  source_system: 'sourceSystem',
  vendor_personnel_id: 'vendorPersonnelId',
  vendor_id: 'vendorId',
  role_id: 'roleId',
  pcard_flag: 'pcardFlg',
  dispatch_flag: 'dispatchableFlag',
  first_name: 'firstName',
  middle_name: 'middleName',
  last_name: 'lastName',
  date_of_birth_date: 'dateOfBirth',
  is_copart_employee: 'isCopartEmp',
  start_date: 'startDate',
  end_date: 'endDate',
  phone_number: 'phoneNum',
  phone_extension: 'phoneExt',
  short_name: 'shortName',
};

const pcardMap = {
  created_at: 'createDate',
  updated_at: 'lastUpdateDate',
  created_by: 'createUser',
  updated_by: 'lastUpdateUser',
  source_system: 'sourceSystem',
  correlation_id: 'correlationId',
  vendor_personnel_id: 'vendorPersonnelId',
  card_number: 'cardNumber',
  security_code: 'securityCode',
  aba_bank_number: 'abaBnkNumber',
  bank_account_number: 'bankAccountNumber',
  start_date: 'startDate',
  end_date: 'endDate',
  cancel_date: 'cancelDate',
  pcard_cas_number: 'pcardCASNumber',
  pcard_id: 'pcardId',
  pcard_type: 'pcardType',
};

export const groupsDataMapper = data => map(renameKeys(groupMap))(data);

const pcardMapper = { pcard: renameKeys(pcardMap) };
const mapPeronnelItems = evolve(pcardMapper);
export const personnelDataMapper = map(compose(mapPeronnelItems, renameKeys(personnelMap)));
export const singlePersonnelMapper = compose(mapPeronnelItems, renameKeys(personnelMap));
