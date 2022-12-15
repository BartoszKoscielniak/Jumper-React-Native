import Matter from "matter-js";
import {Dimensions} from 'react-native'
import {getPlatformSizePosPair, getTrapRandPos} from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

function Physics(entities, {touches, time, dispatch}) {

    let playerBody = entities.Player.body;
    let playerSize = playerBody.bounds.max.x - playerBody.bounds.min.x;
    let playerPos = playerBody.position;
    let platformVelocity = entities['PlatformVelocity'].y;
    let playerVelocity = playerBody.velocity;

    for (let index = 1; index <= 3; index++) {
        if(entities[`Bomb${index}`] !== undefined) {

            if(( entities[`Bomb${index}`].body.bounds.max.y >= playerPos.y && entities[`Bomb${index}`].body.bounds.min.y <= playerPos.y &&
                entities[`Bomb${index}`].body.bounds.max.x >= playerPos.x && entities[`Bomb${index}`].body.bounds.min.x <= playerPos.x )) {
                dispatch( { type: 'game_over' } );
            }

            if(entities[`Bomb${index}`].body.bounds.max.y >= windowHeight) {
                let bombPos = getTrapRandPos();
                Matter.Body.setPosition( entities[`Bomb${index}`].body, { x: bombPos.x, y: -100 } )
            }

            Matter.Body.translate( entities[`Bomb${index}`].body, { x: 0, y: platformVelocity * 3 } )
        }
    }

    return entities;
}

export default Physics