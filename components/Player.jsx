import Matter from 'matter-js'
import React from 'react'
import {Image, View} from 'react-native'

const Player = props => {
  const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
  const heightBody = props.body.bounds.max.y - props.body.bounds.min.y

  const xBody = props.body.position.x - widthBody /2
  const yBody = props.body.position.y - heightBody /2

  return(
      <Image
          source={require('../assets/ninjaFog.png')}
          style={{
              width: widthBody,
              height: heightBody,
              resizeMode: 'contain',
              position: 'absolute',
              left: xBody,
              top: yBody}}
      />
  )
}

export default (world, color, pos, size) => {
  const initialPlayer = Matter.Bodies.rectangle(
      pos.x,
      pos.y,
      size.width,
      size.height,
      {
          label: 'Player',
          collisionFilter: {
              'group': -1,
              'category': 2,
              'mask': 2,
          },
      }
  )
  Matter.World.add(world, initialPlayer)

  return {
      body: initialPlayer,
      color,
      pos,
      renderer: <Player/>
  }
}
