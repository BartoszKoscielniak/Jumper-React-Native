import Matter from "matter-js";
import {Dimensions} from 'react-native'
import {getPlatformSizePosPair} from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

function Physics(entities, {touches, time, dispatch}) {

    let engine = entities.physics.engine
    let playerBody = entities.Player.body;
    let playerSize = playerBody.bounds.max.x - playerBody.bounds.min.x;
    let playerPos = playerBody.position;
    let playerVelocity = playerBody.velocity;
    let platformVelocity = entities['PlatformVelocity'].y;

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

        if(entities['Platform'] !== undefined && playerVelocity.y < -1){
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

    if(entities['Bomb'] !== undefined && entities['Bomb'].body.position.x === playerPos.x && entities['Bomb'].body.position.y === playerPos.y){
        dispatch({type: 'game_over'});
    }


    if(playerPos.y - playerSize > windowHeight) {
        dispatch({type: 'game_over'})
    }

    return entities;
}

export default Physics