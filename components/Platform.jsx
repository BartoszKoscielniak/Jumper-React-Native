import Matter from 'matter-js'
import React from 'react'
import {Image, View} from 'react-native'

const Platform = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody / 2
    const yBody = props.body.position.y - heightBody / 2

    const textureSize = 40;

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
            {Array.apply(null, Array(Math.ceil(widthBody / textureSize))).map((el, idx) => {
                return <Image style={{width: 40, height: 40}} key={idx} resizeMode="stretch"
                              source={require('../assets/platform/terrainGreen40.png')}/>
            })}
        </View>
    )
}

export default (world, color, pos, size) => {
    const initialPlatform = Matter.Bodies.rectangle(
        pos.x,
        pos.y,
        size.width,
        size.height,
        {
            label: 'Platform',
            collisionFilter: {
                'group': 1,
                'category': 2,
                'mask': 2,
            },
            isStatic: true
        }
    )


    Matter.World.add(world, initialPlatform)

    return {
        body: initialPlatform,
        color,
        pos,
        renderer: <Platform/>
    }
}
