import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import { GameEngine } from 'react-native-game-engine'; 
import entities from './entities';
import Physics from './utils/physics';
import {backgroundBrown} from "./assets";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function App() {
    const [running, setRunning] = useState(false)
    const [gameEngine, setGameEngine] = useState(null)
    const [points, setPoints] = useState(0)
    const [gameStatus, setGameStatus] = useState(null)

    useEffect(() => {
        setRunning(false)
    }, [])

    return (

    <View style={{flex: 1}}>
        <Image
            source={backgroundBrown}
            style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: windowWidth,
            height: windowHeight
            }}
            resizeMode={"repeat"}
        />
        {}
        { running ?
        <Text style={{textAlign: 'center', fontSize: 50, fontWeight: 'bold', margin: 20}}>{points}</Text>
        : null}
      <GameEngine
      ref={(ref) => { setGameEngine(ref) }}
      systems={[Physics]}
      entities={entities()}
      running={running}
      onEvent={(e) => {
        switch(e.type){
          case 'game_over':
            setRunning(false)
            setGameStatus(e.type)
            gameEngine.stop()
            break;
          case 'new_point':
            setPoints(points + 1)
            break;
        }
      }}
      style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
      >
      <StatusBar style="auto" hidden={true}/>
      </GameEngine>
      {!running && gameStatus === null?
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={{backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 10}}
          onPress={ () => {
            setPoints(0)
            setRunning(true)
            gameEngine.swap(entities())
          }}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30}}>
              START
            </Text>
          </TouchableOpacity>
      </View> : null}
        {!running && gameStatus === 'game_over' ?
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={{backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 10}}
          onPress={ () => {
            setPoints(0)
            setRunning(true)
            gameEngine.swap(entities())
          }}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30}}>
              GAME OVER
            </Text>
              <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30, textAlign: "center"}}>
                  Points: {points}
            </Text>
          </TouchableOpacity>
      </View> : null}

    </View>

  );
}