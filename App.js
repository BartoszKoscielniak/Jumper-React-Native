import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import entities from './entities';
import Physics from './systems/Physics';
import Control from './systems/Control';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function App() {
    const [running, setRunning] = useState(false)
    const [gameEngine, setGameEngine] = useState(null)
    const [points, setPoints] = useState(0)
    const [gameStatus, setGameStatus] = useState(null)
    const [bestScore, setBestScore] = useState(0)

    useEffect(() => {
        setRunning(false)
    }, [])

    return (
        <View style={{flex: 1}}>
            <Image
                source={require('./assets/Background/Brown.png')}
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
            {running ?
                <Text style={{textAlign: 'center', fontSize: 50, fontWeight: 'bold', margin: 20}}>{points}</Text>
                : null}
            <GameEngine
                ref={(ref) => {
                    setGameEngine(ref)
                }}
                systems={[Physics, Control]}
                entities={entities()}
                running={running}
                onEvent={(e) => {
                    switch(e.type) {
                        case 'game_over':
                            setRunning(false)
                            setGameStatus(e.type)
                            gameEngine.stop()
                            if(points > bestScore){
                                setBestScore(points)
                                saveToJson(points.toString());
                            }
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
            {!running && gameStatus === null ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        source={require('./assets/Background/Gray.png')}
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
                    <TouchableOpacity style={{backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 10}}
                                      onPress={() => {
                                          setPoints(0)
                                          setRunning(true)
                                          gameEngine.swap(entities())
                                          fileExist().then(getTextFromFile().then(r => setBestScore(parseInt(r))))
                                      }}>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30}}>
                            START
                        </Text>
                    </TouchableOpacity>
                </View> : null}
            {!running && gameStatus === 'game_over' ?
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                        source={require('./assets/Background/Gray.png')}
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
                    <TouchableOpacity style={{backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 10}}
                                      onPress={() => {
                                          setPoints(0)
                                          setRunning(true)
                                          gameEngine.swap(entities())
                                      }}>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30, textAlign: "center"}}>
                            GAME OVER
                        </Text>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30, textAlign: "center"}}>
                            Points: {points}
                        </Text>
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 30, textAlign: "center"}}>
                            Best score: {bestScore}
                        </Text>
                    </TouchableOpacity>
                </View> : null}
        </View>
    );
}

async function saveToJson(score) {
    let fileUri = FileSystem.documentDirectory + "text.txt";
    await FileSystem.writeAsStringAsync(fileUri, score, { encoding: FileSystem.EncodingType.UTF8 });
    const asset = await MediaLibrary.createAssetAsync(fileUri)
    await MediaLibrary.createAlbumAsync("Download", asset, false)
}

async function loadFile () {
    let filename = FileSystem.documentDirectory + "text.txt";
    return await FileSystem.readAsStringAsync( filename, { encoding: FileSystem.EncodingType.UTF8 } );
}

async function getTextFromFile () {
    let value = loadFile();
    return await value;
}

async function fileExist () {
    FileSystem.getInfoAsync( 'file://text.txt' ).then(r => {
        if(r.exists === false){
            saveToJson("0")
        }
    });
}