import Matter from "matter-js";
import {Dimensions} from 'react-native'
import getVelocityVector from "../utils/DirectionVector";

const windowHeight = Dimensions.get( 'window' ).height

const Control = ( entities, { touches, time, dispatch, swap } ) => {

    let moveVelocity = entities['PlayerVelocity'].x;
    let jumpVelocity = entities['PlayerVelocity'].y;
    let playerBody = entities.Player.body;
    let playerSize = playerBody.bounds.max.x - playerBody.bounds.min.x;
    let playerPos = playerBody.position;

    const onPlatform = ( playerPos ) => {//funkcja sprawdzajaca czy gracz znajduje sie w przestrzenii platformy, sprawdzane w celu sprawdzenia mozliwosci wykonania skoku
        for (let index = 1; index <= 6; index++) {
            if(entities[`Platform${index}`] === undefined){
                continue;
            }

            if(playerPos.x < entities[`Platform${index}`].body.bounds.max.x + playerSize / 2 &&
                playerPos.x > entities[`Platform${index}`].body.bounds.min.x - playerSize / 2 &&
                playerPos.y <= entities[`Platform${index}`].body.bounds.min.y &&
                playerPos.y >= entities[`Platform${index}`].body.bounds.min.y - playerSize){
                return true;
            }
        }
        return entities[`Platform`] !== undefined && playerPos.x < entities[`Platform`].body.bounds.max.x && playerPos.x > entities[`Platform`].body.bounds.min.x &&
            playerPos.y <= entities[`Platform`].body.bounds.min.y && playerPos.y >= entities[`Platform`].body.bounds.min.y - playerSize;
    }

    touches.filter( t => t.type === 'start' || t.type === 'end' || t.type === 'move' ).forEach( element => {//odczytywanie evenow dotyku ekranu
        if(element.event.pageY > windowHeight / 2) {
            if(element.type === 'start') {
                Matter.Body.setPosition( entities.Joystick2.body, {//utworzenie i umiejscowienie pierwszego elementu joysticka
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
                    && entities.Joystick1.body.position.y !== entities.Joystick2.body.position.y) {//wyliczanie wektora ruchu i nadawanie postaci pedu
                    let vVector = getVelocityVector( {
                        x: entities.Joystick1.body.position.x,
                        y: entities.Joystick1.body.position.y
                    }, { x: entities.Joystick2.body.position.x, y: entities.Joystick2.body.position.y } );
                    if(onPlatform(playerPos)){
                        Matter.Body.setVelocity( playerBody, {
                            x: vVector.x * moveVelocity,
                            y: vVector.y * jumpVelocity
                        })
                    }
                    Matter.Body.setPosition( entities.Joystick1.body, {
                        x: -100,
                        y: -100
                    })
                    Matter.Body.setPosition( entities.Joystick2.body, {
                        x: -100,
                        y: -100
                    })
                }
            }
        }
    });
    return entities;
}
export default Control