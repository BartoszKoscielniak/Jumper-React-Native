import Matter from 'matter-js'
import React from 'react'
import {Image, View} from 'react-native'

const Bomb = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody / 2
    const yBody = props.body.position.y - heightBody / 2

    const textureSize = 22;

    return (
        <View
            style={{
                position: "absolute",
                left: xBody,
                top: yBody,
                width: widthBody,
                height: heightBody,
                overflow: 'hidden',
                flexDirection: 'row'
            }}>
            {Array.apply (null, Array (Math.floor (widthBody / textureSize))).map ((el, idx) => {
                return <Image style={{width: 22, height: 22}} key={idx} resizeMode="stretch"
                              source={require ('../assets/bomb.png')}/>
            })}
        </View>
    )
}

export default (world, label, color, pos, size) => {
    const initialObstacle = Matter.Bodies.rectangle (
        pos.x,
        pos.y,
        size.width,
        size.height, {
            label: 'Platform',
            isStatic: true
        }
    )
    Matter.World.add (world, initialObstacle)

    return {
        body: initialObstacle,
        color,
        pos,
        renderer: <Bomb/>
    }
}
