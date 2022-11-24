import Matter from "matter-js"
import Player from "../components/Player";

export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false })
    let world = engine.world
    engine.gravity.y = 0.4;

    return{
        physics: { engine, world },
        Player: Player(world, 'green', { x: 50, y: 200 }, { height: 40, width: 40 }),
    }
}