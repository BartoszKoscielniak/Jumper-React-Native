import Matter from "matter-js";
import {Dimensions} from 'react-native'
import {getPlatformSizePosPair} from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const Physics = (entities, {touches, time, dispatch}) => {

    let engine = entities.physics.engine
    let playerBody = entities.Player.body;
    let playerSize = playerBody.bounds.max.x - playerBody.bounds.min.x;
    let playerPos = playerBody.position;
    let playerVelocity = playerBody.velocity;
    let platformVelocity = entities['PlatformVelocity'].y;

    if(playerPos.x + playerSize > windowWidth) {//uniemozliwienie przemieszczenia poza krawedz ekranu
        Matter.Body.setPosition(entities.Player.body, {
            x: windowWidth - playerSize,
            y: playerPos.y
        })
    }

    if(playerPos.x - playerSize < 0) {
        Matter.Body.setPosition(entities.Player.body, {//uniemozliwienie przemieszczenia poza krawedz ekranu
            x: playerSize,
            y: playerPos.y
        })
    }

    Matter.Engine.update(engine, time.delta)

    for (let index = 1; index <= 6; index++) {//iterowanie po obiektach platform

        if(entities[`Platform${index}`] === undefined){//sprawdzenie czy platforma istnieje, od poziomu 3 istnieje jedna wiecej
            continue;
        }

        if(entities[`Platform${index}`].body.bounds.max.y >= playerPos.y && !entities[`Platform${index}`].point && playerVelocity.y < -1) {//mechanizm zdobywania punkow
            entities[`Platform${index}`].point = true;
            dispatch({type: 'new_point'})
        }

        if(entities[`Platform${index}`].body.bounds.max.y >= windowHeight) {//respawn platform za gorna krawedzia ekranu, gdy te znajda sie ponizej dolnej krawedzi
            let platformSizePos = getPlatformSizePosPair(windowHeight);
            if(index === 3 && entities[`Platform6`] !== undefined) {
                let platformSize = entities[`Platform3`].body.bounds.max.x - entities[`Platform3`].body.bounds.min.x;
                Matter.Body.setPosition(entities[`Platform3`].body, platformSizePos.platform.pos)
                Matter.Body.setPosition(entities[`Platform6`].body, {x: platformSizePos.platform.pos.x + 30 + platformSize,y: platformSizePos.platform.pos.y})
                entities[`Platform${index}`].point = false;
            }
            Matter.Body.setPosition(entities[`Platform${index}`].body, platformSizePos.platform.pos)
            entities[`Platform${index}`].point = false;
        }

        if(playerVelocity.y >= 0) {//manipulowanie velocity platformy
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity})
        } else if (playerVelocity.y < 0 && playerPos.y < windowHeight / 2) {
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity - playerVelocity.y * 1.25})
        }else {
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity - playerVelocity.y})
        }

        if(entities['Platform'] !== undefined && playerVelocity.y < -1){//usuniecie platformy po rozpoczeciu gry przez gracza
            Matter.Body.translate(entities['Platform'].body, {x: 0, y: -playerVelocity.y * 2})
            Matter.Composite.remove(engine.world, entities['Platform'].body);
        }

        if(playerVelocity.y >= 0) {//mechanizm manipulowania przenikalnoscia gracza przez platforme
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

    if(playerPos.y - playerSize > windowHeight) {//warunek przegranej
        dispatch({type: 'game_over'})
    }

    return entities;
}

export default Physics
