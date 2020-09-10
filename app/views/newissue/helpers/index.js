// @flow

export const getHeaderText = (entity: string, data: Object): string => {
  let headerText = '';
  if (entity && entity === 'trip') {
    if (data.length === 1) {
      headerText = `TRIP# ${data[0]}`;
    } else {
      headerText = `TRIP# ${data[0]} + ${data.length - 1} more`;
    }
  } else if (entity && entity === 'lot') {
    headerText = `LOT # ${data.number}`;
  }
  return headerText;
};
