import { Dimensions } from 'react-native'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getPlatformSizePosPair = (addToPosY = 0) => {
    let pWidth = getRandom(100, windowWidth / 2.5)
    let xPos = getRandom(60, windowWidth - pWidth)

    const platform = { pos: { x: xPos, y: windowHeight - addToPosY}, size: { height: 22, width: pWidth } }

    return { platform }

}