import Matter from "matter-js";
import {Dimensions} from 'react-native'
import {getPlatformSizePosPair} from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

function Physics(entities, {touches, time, dispatch}) {

    let engine = entities.physics.engine
    let playerSize = 40;
    let playerPos = entities.Player.body.position;
    let playerBody = entities.Player.body;
    let playerVelocity = playerBody.velocity;
    let platformVelocity = 1;

    if(playerPos.y < windowHeight / 3 * 2) {
        platformVelocity = 3.5;
        engine.gravity.y = 1.1;
    }else if(playerPos.y < windowHeight / 3){
        platformVelocity = 3.75;
        engine.gravity.y = 1.2;
    }

    if(playerPos.x + playerSize > windowWidth) {
        Matter.Body.setPosition(entities.Player.body, {
            x: windowWidth - playerSize,
            y: playerPos.y
        })
    }

    if(playerPos.x - playerSize < 0) {
        Matter.Body.setPosition(entities.Player.body, {
            x: playerSize,
            y: playerPos.y
        })
    }

    Matter.Engine.update(engine, time.delta)

    for (let index = 1; index <= 5; index++) {

        if(entities[`Platform${index}`].body.bounds.max.y >= playerPos.y && !entities[`Platform${index}`].point && playerVelocity.y < -1) {
            entities[`Platform${index}`].point = true;
            dispatch({type: 'new_point'})
        }

        if(entities[`Platform${index}`].body.bounds.max.y >= windowHeight) {
            let platformSizePos = getPlatformSizePosPair(windowHeight);
            Matter.Body.setPosition(entities[`Platform${index}`].body, platformSizePos.platform.pos)
            entities[`Platform${index}`].point = false;
        }

        if(playerVelocity.y >= 0) {
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity})
        } else if (playerVelocity.y < 0 && playerPos.y < windowHeight / 2) {
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity - playerVelocity.y * 1.25})
        }else {
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity - playerVelocity.y})
        }

        if(playerVelocity.y < -1){
            Matter.Body.translate(entities['Platform'].body, {x: 0, y: -playerVelocity.y * 2})
            Matter.Composite.remove(engine.world, entities['Platform'].body);
        }

        if(playerVelocity.y >= 0) {
            entities[`Platform${index}`].body.collisionFilter = {
                'group': 1,
                'category': 2,
                'mask': 2,
            };
        } else {
            entities[`Platform${index}`].body.collisionFilter = {
                'group': 1,
                'category': 2,
                'mask': 4,
            };
        }
    }

    if(playerPos.y - playerSize > windowHeight) {
        dispatch({type: 'game_over'})
    }

    return entities;
}

export default Physics