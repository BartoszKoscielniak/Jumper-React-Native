import Matter from "matter-js";
import {Dimensions} from 'react-native'
import {getVelocityVector} from "../utils/DirectionVector";
import entities from "../entities";

const windowHeight = Dimensions.get( 'window' ).height
const windowWidth = Dimensions.get( 'window' ).width

function Control ( entities, { touches, time, dispatch } ) {

    let moveVelocity = 8;
    let jumpVelocity = 20;
    let playerSize = 36;
    let playerPos = entities.Player.body.position;
    let playerBody = entities.Player.body;
    let playerVelocity = playerBody.velocity;

    const onPlatform = ( playerPos ) => {
        for (let index = 1; index <= 5; index++) {
            if(playerPos.x < entities[`Platform${index}`].body.bounds.max.x + playerSize / 2 &&
                playerPos.x > entities[`Platform${index}`].body.bounds.min.x - playerSize / 2 &&
                playerPos.y <= entities[`Platform${index}`].body.bounds.min.y &&
                playerPos.y >= entities[`Platform${index}`].body.bounds.min.y - playerSize){
                return true;
            }
        }
        return playerPos.x < entities[`Platform`].body.bounds.max.x && playerPos.x > entities[`Platform`].body.bounds.min.x &&
            playerPos.y <= entities[`Platform`].body.bounds.min.y && playerPos.y >= entities[`Platform`].body.bounds.min.y - playerSize;

    }

    if(playerPos.y < windowHeight / 2) {
        jumpVelocity = 18;
    }

    touches.filter( t => t.type === 'start' || t.type === 'end' || t.type === 'move' ).forEach( element => {
        if(element.event.pageY > windowHeight / 2) {
            if(element.type === 'start') {
                Matter.Body.setPosition( entities.Joystick2.body, {
                    x: element.event.pageX,
                    y: element.event.pageY
                } )
            }

            if(element.type === 'move' && entities.Joystick2.body.position.x > -100) {
                Matter.Body.setPosition( entities.Joystick1.body, {
                    x: element.event.pageX,
                    y: element.event.pageY
                } )
            }

            if(element.type === 'end' && entities.Joystick2.body.position.x > -100) {
                Matter.Body.setPosition( entities.Joystick1.body, {
                    x: element.event.pageX,
                    y: element.event.pageY
                } )

                if(entities.Joystick1.body.position.x !== entities.Joystick2.body.position.x
                    && entities.Joystick1.body.position.y !== entities.Joystick2.body.position.y) {
                    let vVector = getVelocityVector( {
                        x: entities.Joystick1.body.position.x,
                        y: entities.Joystick1.body.position.y
                    }, { x: entities.Joystick2.body.position.x, y: entities.Joystick2.body.position.y } );
                    if(onPlatform(playerPos)){
                        Matter.Body.setVelocity( entities.Player.body, {
                            x: vVector.x * moveVelocity,
                            y: vVector.y * jumpVelocity
                        } )
                    }
                    Matter.Body.setPosition( entities.Joystick1.body, {
                        x: -100,
                        y: -100
                    } )
                    Matter.Body.setPosition( entities.Joystick2.body, {
                        x: -100,
                        y: -100
                    } )
                }
            }
        }
    } );

    return entities;
}



export default Control