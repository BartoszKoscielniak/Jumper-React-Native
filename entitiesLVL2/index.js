import Matter from "matter-js"
import Platform from "../components/Platform";
import Player from "../components/Player";
import {Dimensions} from "react-native";
import Obstacle2 from "../components/Obstacle2";
import {getPlatformSizePosPair} from "../utils/random";
import Joystick from "../components/Joystick";
import Bomb from "../components/Bomb";

const windowHeight = Dimensions.get ( 'window' ).height;
const windowWidth = Dimensions.get ( 'window' ).width;

export default () => {
    let engine = Matter.Engine.create ( { enableSleeping: false } )
    let world = engine.world
    engine.gravity.y = 0.9;

    const platformSizePosAA = getPlatformSizePosPair ( windowHeight * 0.2 )
    const platformSizePosA = getPlatformSizePosPair ( windowHeight * 0.4 )
    const platformSizePosB = getPlatformSizePosPair ( windowHeight * 0.6 )
    const platformSizePosC = getPlatformSizePosPair ( windowHeight * 0.8 )
    const platformSizePosD = getPlatformSizePosPair ( windowHeight )

    return {
        physics: { engine, world },
        Player: Player ( world, 'green', { x:  platformSizePosB.platform.pos.x, y:  platformSizePosB.platform.pos.y - 36 }, { height: 36, width: 36 } ),

        Platform1: Obstacle2 ( world, 'Platform1', 'red', platformSizePosAA.platform.pos, platformSizePosAA.platform.size ),
        Platform2: Obstacle2 ( world, 'Platform2', 'red', platformSizePosA.platform.pos, platformSizePosA.platform.size ),
        Platform3: Obstacle2 ( world, 'Platform3', 'purple', platformSizePosB.platform.pos, platformSizePosB.platform.size ),
        Platform4: Obstacle2 ( world, 'Platform4', 'grey', platformSizePosC.platform.pos, platformSizePosC.platform.size ),
        Platform5: Obstacle2 ( world, 'Platform5', 'black', platformSizePosD.platform.pos, platformSizePosD.platform.size ),
        Platform6: Obstacle2 ( world, 'Platform6', 'black', {x: platformSizePosB.platform.pos.x + 30 + platformSizePosB.platform.size.width, y: platformSizePosB.platform.pos.y}, {width: platformSizePosB.platform.size.width / 2, height: platformSizePosB.platform.size.height} ),

        Bomb1: Bomb(world, 'Bomb', 'black', {x:155, y: -100}, {width: 28, height: 28}),
        Bomb2: Bomb(world, 'Bomb', 'black', {x:333, y: -100}, {width: 28, height: 28}),

        PlayerVelocity:     {x: 8, y: 12},
        PlatformVelocity:   {y: 1.5},

        Joystick1: Joystick ( world, 'black', { x: -100, y: -100 }, 20 ),
        Joystick2: Joystick ( world, 'black', { x: -100, y: -100 }, 30 )
    }
}