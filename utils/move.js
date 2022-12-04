export const getVelocityVector = (playerPos, destination) => {

    const vector = {x: destination.x - playerPos.x, y: destination.y - playerPos.y };
    const vectorLenght = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    const directory = {x: vector.x / vectorLenght, y: vector.y / vectorLenght};

    return directory;
}

