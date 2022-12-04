import Matter from "matter-js";
import { Dimensions } from 'react-native'
import { getPlatformSizePosPair } from "./random";
import { getVelocityVector } from "./move";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

function Physics  (entities, {touches, time, dispatch}) {

    let engine = entities.physics.engine
    let moveVelocity = 8;
    let jumpVelocity = 20;
    let playerSize = 40;
    let playerPos = entities.Player.body.position;
    let playerBody = entities.Player.body;
    let playerVelocity = playerBody.velocity;

    //TODO: score board zapisywalny, skok tylko na platformie
    if (playerVelocity.y > -0.5 && playerVelocity.y < 0.5 || true) {
        touches.filter(t => t.type === 'start' || t.type === 'end' || t.type === 'move').forEach(element => {

            if (element.event.pageY > windowHeight/3 * 2) {

                if (element.type === 'start') {
                    Matter.Body.setPosition(entities.Joystick2.body, {
                        x: element.event.pageX,
                        y: element.event.pageY
                    })
                }

                if (element.type === 'move' && entities.Joystick2.body.position.x > -100) {
                    Matter.Body.setPosition(entities.Joystick1.body, {
                        x: element.event.pageX,
                        y: element.event.pageY
                    })
                }

                if (element.type === 'end' && entities.Joystick2.body.position.x > -100) {
                    Matter.Body.setPosition(entities.Joystick1.body, {
                        x: element.event.pageX,
                        y: element.event.pageY
                    })
                    const vVector = getVelocityVector({
                        x: entities.Joystick1.body.position.x,
                        y: entities.Joystick1.body.position.y
                    }, {x: entities.Joystick2.body.position.x, y: entities.Joystick2.body.position.y});
                    Matter.Body.setVelocity(entities.Player.body, {
                        x: vVector.x * moveVelocity,
                        y: vVector.y * jumpVelocity
                    })
                    Matter.Body.setPosition(entities.Joystick1.body, {
                        x: -100,
                        y: -100
                    })
                    Matter.Body.setPosition(entities.Joystick2.body, {
                        x: -100,
                        y: -100
                    })
                }
            }
        });
    }

    if(playerPos.x + playerSize > windowWidth){
        Matter.Body.setPosition(entities.Player.body, {
            x: windowWidth - playerSize,
            y: playerPos.y
        })
    }
    
    if(playerPos.x - playerSize < 0){
        Matter.Body.setPosition(entities.Player.body, {
            x: playerSize,
            y: playerPos.y
        })
    }

    Matter.Engine.update(engine, time.delta)

    //let points = 0;
    let platformVelocity = 1;
/*     if(points >= 50 && points <= 100){
        platformVelocity = 1.5;
    }else if (points >= 100 && points <= 150){
        platformVelocity = 2;
    }else{
        platformVelocity = 2.5;
    } */
    

    for (let index = 1; index <= 6; index++) {

        if(entities[`Platform${index}`].body.bounds.max.y >= playerPos.y && !entities[`Platform${index}`].point){
            entities[`Platform${index}`].point = true;
            dispatch({type: 'new_point'})
        } 

        if(entities[`Platform${index}`].body.bounds.max.y >= windowHeight){
            const platformSizePos = getPlatformSizePosPair( windowHeight );
            Matter.Body.setPosition(entities[`Platform${index}`].body, platformSizePos.platform.pos)
            entities[`Platform${index}`].point = false;
        } 

        if (playerVelocity.y >= 0 ){
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity})
        }else{
            Matter.Body.translate(entities[`Platform${index}`].body, {x: 0, y: platformVelocity - playerVelocity.y})
            Matter.Body.translate(entities['Platform'].body, {x:0, y: -playerVelocity.y * 2})
        }

        if (playerVelocity.y >= 0){
            entities[`Platform${index}`].body.collisionFilter = {
                'group': 1,
                'category': 2,
                'mask': 2,
            };
        }else{
            entities[`Platform${index}`].body.collisionFilter = {
                'group': 1,
                'category': 2,
                'mask': 4,
            };
        }
    }

    if (playerPos.y - playerSize > windowHeight){
        dispatch({ type: 'game_over' })
    }

    return entities;
}

export default Physics