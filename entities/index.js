import Matter from "matter-js"
import Platform from "../components/Platform";
import Player from "../components/Player";
import { Dimensions } from "react-native";
import Obstacle from "../components/Obstacle";
import { getPipeSizePosPair } from "../utils/random";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false })
    let world = engine.world
    engine.gravity.y = 0.4;


    const pipeSizePosA = getPipeSizePosPair(  )
    const pipeSizePosB = getPipeSizePosPair( windowWidth * 0.9 )
    return{
        physics: { engine, world },
        Player: Player(world, 'green', { x: 50, y: 200 }, { height: 40, width: 40 }),

        Obstacletop1: Obstacle(world, 'Obstacletop1', 'red', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size),
        Obstaclebottom1: Obstacle(world, 'Obstaclebottom1', 'red', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size),
        Obstacletop2: Obstacle(world, 'Obstacletop2', 'red', pipeSizePosB.pipeTop.pos, pipeSizePosB.pipeTop.size),
        Obstaclebottom2: Obstacle(world, 'Obstaclebottom2', 'red', pipeSizePosB.pipeBottom.pos, pipeSizePosB.pipeBottom.size),


        Platform: Platform(world, 'green', { x: windowWidth / 2, y: windowHeight }, { height: 40, width: windowWidth }),

    }
}