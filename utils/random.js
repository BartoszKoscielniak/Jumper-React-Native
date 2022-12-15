import {Dimensions} from 'react-native'

const windowHeight = Dimensions.get( 'window' ).height
const windowWidth = Dimensions.get( 'window' ).width

export const getRandom = ( min, max ) => {
    return Math.floor( Math.random() * ( max - min + 1 ) + min )
}

export const getPlatformSizePosPair = ( addToPosY = 0 ) => {
    let pWidth = getRandom( 100, windowWidth / 2.5 )
    let xPos = getRandom( 60, windowWidth - pWidth - 100 )

    const platform = { pos: { x: xPos, y: windowHeight - addToPosY }, size: { height: 22, width: pWidth } }

    return { platform }

}

export const getTrapRandPos = () => {
    let xPos = getRandom( 28, windowWidth - 100 )
    let yPos = getRandom( 30, windowWidth - 100 )

    return { x: xPos, y: yPos }
}