import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import lvl1 from './entities';
import lvl2 from './entitiesLVL2';
import lvl3 from './entitiesLVL3';
import Physics from './systems/Physics';
import Control from './systems/Control';
import Traps from './systems/Traps';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";
import * as Permissions from 'expo-permissions';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function App() {

    const [running, setRunning]         = useState(false)
    const [gameEngine, setGameEngine]   = useState(null)
    const [points, setPoints]           = useState(0)
    const [gameStatus, setGameStatus]   = useState(null)
    const [bestScore, setBestScore]     = useState(0)
    const [lvl, setLvl]                 = useState(1)
    const [background, setBackground]   = useState(require( './assets/Background/Brown.png' ))

//TODO: system zbierania gwiazdek, boostowanie velocity przez zjedzenie jabluszka, opisac troche kodu w dokumetnacji
    useEffect(() => {
        setRunning(false)
    }, [])

    return (
        <View style={{flex: 1}}>
            <Image
                source={background}
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
                <View style={{flexDirection:"row"}}>
                    <View style={{flex:1}}>
                        <Text style={{textAlign: 'left', fontSize: 25, fontWeight: 'bold', margin: 20}}>LVL {lvl}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{textAlign: 'right', fontSize: 25, fontWeight: 'bold', margin: 20}}>Points {points}</Text>
                    </View>
                </View>
                : null}
            <GameEngine
                ref={(ref) => {
                    setGameEngine(ref)
                }}
                systems={[Physics, Control, Traps]}
                entities={lvl1()}
                running={running}
                onEvent={(e) => {
                    switch(e.type) {
                        case 'game_over':
                            setRunning(false)
                            setGameStatus(e.type)
                            setLvl(1);
                            setBackground(require('./assets/Background/Brown.png'));
                            gameEngine.stop()
                            if(points > bestScore){
                                setBestScore(points)
                                saveToJson(points.toString());
                            }
                            break;
                        case 'new_point':
                            setPoints(points + 1)
                            if(points === 15 && lvl === 1){
                                gameEngine.swap(lvl2());
                                setBackground(require('./assets/Background/Gray.png'));
                                setLvl(2);
                            }

                            if(points === 30 && lvl === 2){
                                gameEngine.swap(lvl3());
                                setBackground(require('./assets/Background/Purple.png'));
                                setLvl(3);
                            }
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
                        source={require('./assets/Background/Yellow.png')}
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
                                          gameEngine.swap(lvl1())
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
                        source={require('./assets/Background/Yellow.png')}
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
                                          gameEngine.swap(lvl1())
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
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if(status === 'granted') {
        let fileUri = FileSystem.documentDirectory + "text.txt";
        await FileSystem.writeAsStringAsync( fileUri, score, { encoding: FileSystem.EncodingType.UTF8 } );
        const asset = await MediaLibrary.createAssetAsync( fileUri )
        await MediaLibrary.createAlbumAsync( "Download", asset, false )
    }
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