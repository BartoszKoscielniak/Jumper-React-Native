import Matter from "matter-js";
import { Dimensions } from 'react-native'
import { getPipeSizePosPair } from "./utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const Physics = (entities, {touches, time, dispatch}) => {
    let engine = entities.physics.engine

    touches.filter(t => t.type === 'press').forEach(element => {
        Matter.Body.setVelocity(entities.Player.body, {
            x: 0,
            y: -8
        })
    });

    Matter.Engine.update(engine, time.delta)

    for (let index = 1; index <= 2; index++) {

        if(entities[`Obstacletop${index}`].body.bounds.max.x <= 50 && !entities[`Obstacletop${index}`].point){
            entities[`Obstacletop${index}`].point = true;
            dispatch({type: 'new_point'})
        }

        if(entities[`Obstacletop${index}`].body.bounds.max.x <= 0){
            const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9);

            Matter.Body.setPosition(entities[`Obstacletop${index}`].body, pipeSizePos.pipeTop.pos)
            Matter.Body.setPosition(entities[`Obstaclebottom${index}`].body, pipeSizePos.pipeBottom.pos)

            entities[`Obstacletop${index}`].point = false
        }

        Matter.Body.translate(entities[`Obstacletop${index}`].body, {x: -3, y: 0})
        Matter.Body.translate(entities[`Obstaclebottom${index}`].body, {x: -3, y: 0})
    }

    Matter.Events.on(engine, 'collisionStart', (event) => {
        dispatch({ type: 'game_over' })
    })

    return entities;
}

export default Physics