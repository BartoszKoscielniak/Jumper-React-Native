import Matter from 'matter-js'
import React from 'react'
import {View} from 'react-native'

const Joystick = props => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

    const xBody = props.body.position.x - widthBody /2
    const yBody = props.body.position.y - heightBody /2
    const color = props.color;

    return(
        <View style={{
            borderWidth: 1,
            backgroundColor: color,
            opacity: 0.5,
            borderStyle: 'solid',
            position: 'absolute',
            borderRadius: 9999,
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody
        }}/>
    )
}

export default (world, color, pos, size) => {
    const initialJoystick = Matter.Bodies.circle(
        pos.x,
        pos.y,
        size,
        {
            label: 'Joystick',
            isStatic: true
        }
    )
    Matter.World.add(world, initialJoystick)

    return {
        body: initialJoystick,
        color,
        pos,
        renderer: <Joystick/>
    }
}
