import { Dimensions } from 'react-native'

const x = Dimensions.get('window').width
const y = Dimensions.get('window').height
const deviceHeight = x
const ratioX = deviceHeight < 568 ? (deviceHeight < 375 ? 0.825 : 1.1) : 1.25

const baseUnit = 16

const unit = baseUnit * ratioX

function widthUnit(val) {
  if (x < 720) {
    if (x < 325) {
      return val * 0.775 * x / 100
    }
    return val * 0.825 * x / 100
  }
  return val * 0.725 * x / 100
}

function px(val) {
  if (x < 720) {
    return val * (y > x ? 1 * y / 100 : 1 * x / 100)
  }
  return val * (y > x ? y / 100 : x / 100)
}

function em(value) {
  return unit * value
}

export default responsiveStyle = {
  homeImgStyles: {
    width: px(6),
    height: px(6)
  }
}
