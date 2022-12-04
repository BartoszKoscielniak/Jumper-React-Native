import Matter from "matter-js"
import Platform from "../components/Platform";
import Player from "../components/Player";
import { Dimensions } from "react-native";
import Obstacle from "../components/Obstacle";
import { getPlatformSizePosPair } from "../utils/random";
import Joystick from "../components/Joystick";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false })
    let world = engine.world
    engine.gravity.y = 0.85;

    const platformSizePosA = getPlatformSizePosPair( windowHeight * 0.15 )
    const platformSizePosB = getPlatformSizePosPair( windowHeight * 0.3 )
    const platformSizePosC = getPlatformSizePosPair( windowHeight * 0.45 )
    const platformSizePosD = getPlatformSizePosPair( windowHeight * 0.6 )
    const platformSizePosE = getPlatformSizePosPair( windowHeight * 0.75 )
    const platformSizePosF = getPlatformSizePosPair( windowHeight * 0.90 )

    return{
        physics: { engine, world },
        Player: Player(world, 'green', { x: windowWidth / 2 - 20, y: windowHeight - 70 }, { height: 36, width: 36 }),

        Platform1: Obstacle(world, 'Platform1', 'red', platformSizePosA.platform.pos, platformSizePosA.platform.size),
        Platform2: Obstacle(world, 'Platform2', 'purple', platformSizePosB.platform.pos, platformSizePosB.platform.size),
        Platform3: Obstacle(world, 'Platform3', 'grey', platformSizePosC.platform.pos, platformSizePosC.platform.size),
        Platform4: Obstacle(world, 'Platform4', 'black', platformSizePosD.platform.pos, platformSizePosD.platform.size),
        Platform5: Obstacle(world, 'Platform5', 'pink', platformSizePosE.platform.pos, platformSizePosE.platform.size),
        Platform6: Obstacle(world, 'Platform6', 'black', platformSizePosF.platform.pos, platformSizePosF.platform.size),

        Platform: Platform(world, 'green', { x: windowWidth / 2, y: windowHeight }, { height: 40, width: windowWidth }),
        Joystick1: Joystick(world, 'black', {x: -100, y: -100}, 20 ),
        Joystick2: Joystick(world, 'black', {x: -100, y: -100} , 30 )

    }
}