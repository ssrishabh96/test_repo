export const validateStep = (dataSource, currentPickupLot) => {
  const items = [];
  for (let section = 0; section < dataSource.length; section += 1) {
    for (let item = 0; item < dataSource[section].data.length; item += 1) {
      if (
        dataSource[section].data[item].required &&
        !currentPickupLot[dataSource[section].data[item].key1]
      ) {
        items.push({
          item,
          section,
          label: dataSource[section].data[item].label,
          key1: dataSource[section].data[item].key1,
        });
      }
    }
  }
  return {
    items,
    foundRequired: items.length !== 0,
    // foundRequired: false,
  };
};
