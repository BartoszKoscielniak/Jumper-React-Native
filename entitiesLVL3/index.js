import Matter from "matter-js"
import Platform from "../components/Platform";
import Player from "../components/Player";
import {Dimensions} from "react-native";
import Obstacle3 from "../components/Obstacle3";
import {getPlatformSizePosPair} from "../utils/random";
import Joystick from "../components/Joystick";

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

        Platform1: Obstacle3 ( world, 'Platform1', 'red', platformSizePosAA.platform.pos, platformSizePosAA.platform.size ),
        Platform2: Obstacle3 ( world, 'Platform2', 'red', platformSizePosA.platform.pos, platformSizePosA.platform.size ),
        Platform3: Obstacle3 ( world, 'Platform3', 'purple', platformSizePosB.platform.pos, platformSizePosB.platform.size ),
        Platform4: Obstacle3 ( world, 'Platform4', 'grey', platformSizePosC.platform.pos, platformSizePosC.platform.size ),
        Platform5: Obstacle3 ( world, 'Platform5', 'black', platformSizePosD.platform.pos, platformSizePosD.platform.size ),

        PlayerVelocity:     {x: 8, y: 25},
        PlatformVelocity:   {y: 2},

        Joystick1: Joystick ( world, 'black', { x: -100, y: -100 }, 20 ),
        Joystick2: Joystick ( world, 'black', { x: -100, y: -100 }, 30 )
    }
}