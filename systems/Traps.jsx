import Matter from "matter-js";
import {Dimensions} from 'react-native'
import {getTrapRandPos} from "../utils/random";

const windowHeight = Dimensions.get('window').height

function Traps(entities, {touches, time, dispatch}) {

    let playerBody = entities.Player.body;
    let playerPos = playerBody.position;
    let platformVelocity = entities['PlatformVelocity'].y;

    for (let index = 1; index <= 3; index++) {//iterowanie po wszystkich obiektach minach
        if(entities[`Bomb${index}`] !== undefined) {//sprawdzenie czy dany obiekt istnieje, na poziomie 2 sa dwie miny, natomiast na 3 juz 3 miny

            if(( entities[`Bomb${index}`].body.bounds.max.y >= playerPos.y && entities[`Bomb${index}`].body.bounds.min.y <= playerPos.y &&
                entities[`Bomb${index}`].body.bounds.max.x >= playerPos.x && entities[`Bomb${index}`].body.bounds.min.x <= playerPos.x )) {//detekcja kolizji
                dispatch( { type: 'game_over' } );
            }

            if(entities[`Bomb${index}`].body.bounds.max.y >= windowHeight) {//ustawienie miny na randomowej pozycji poza gorna krawedzia ekranu
                let bombPos = getTrapRandPos();
                Matter.Body.setPosition( entities[`Bomb${index}`].body, { x: bombPos.x, y: -100 } )
            }

            Matter.Body.translate( entities[`Bomb${index}`].body, { x: 0, y: platformVelocity * 3 } )//opadanie miny
        }
    }

    return entities;
}

export default Traps


