import React, { useEffect, useState } from 'react';
import { Image, Animated, Easing } from 'react-native';

import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import Lottie from 'lottie-react-native';

import musicFly from '../../../assets/lottie-animations/music-fly.json';

import {
  Container,
  Details,
  Actions,
  User,
  Tags,
  Music,
  MusicBox,
  BoxAction,
  TextAction,
} from './styles';

interface Item {
  id: number;
  username: string;
  tags: string;
  music: string;
  likes: number;
  comments: number;
  uri: string;
}

interface Props {
  play: boolean;
  item: Item;
  active: number;
}

const Feed: React.FC<Props> = ({ play, item, active }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (item.id === active) {
      (async () => {
        await videoRef?.current.replayAsync();
      })();
    } else {
      (async () => {
        await videoRef?.current.stopAsync();
      })();
    }
  }, [active]);

  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
  ).start();

  const rotateProp = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <LinearGradient
        colors={['rgba(0,0,0,.3)', 'transparent']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: '70%',
        }}
      />
      <Container
        activeOpacity={1}
        underlayColor={'transparent'}
        onPress={async () => {
          if (isPlaying) {
            await videoRef?.current.pauseAsync();
          } else {
            await videoRef?.current.playAsync();
          }
          setIsPlaying(!isPlaying);
        }}
      >
        <Video
          source={{ uri: item.uri }}
          ref={videoRef}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={play}
          isLooping
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Container>
      <Details>
        <User>{item.username}</User>
        <Tags>{item.tags}</Tags>
        <MusicBox>
          <FontAwesome name="music" size={15} color="#f5f5f5" />
          <Music>{item.music}</Music>
        </MusicBox>
      </Details>
      <Actions>
        <BoxAction>
          <AntDesign
            style={{ alignSelf: 'center' }}
            name="heart"
            size={35}
            color="#fff"
          />
          <TextAction>{item.likes}</TextAction>
        </BoxAction>
        <BoxAction>
          <FontAwesome
            style={{ alignSelf: 'center' }}
            name="commenting"
            size={35}
            color="#fff"
          />
          <TextAction>{item.comments}</TextAction>
        </BoxAction>
        <BoxAction>
          <FontAwesome
            style={{ alignSelf: 'center' }}
            name="whatsapp"
            size={35}
            color="#06d755"
          />
          <TextAction>Share</TextAction>
        </BoxAction>
        <BoxAction>
          <Animated.View
            style={{
              borderRadius: 50,
              borderWidth: 12,
              borderColor: '#292929',
              transform: [
                {
                  rotate: (play && isPlaying) ? rotateProp : 0,
                },
              ],
            }}
          >
            <Image
              style={{
                width: 35,
                height: 35,
                borderRadius: 25,
              }}
              source={{
                uri: 'https://avatars3.githubusercontent.com/u/45601574',
              }}
            />
          </Animated.View>

          <Lottie
            source={musicFly}
            progress={play ? spinValue : 0}
            style={{ width: 150, position: 'absolute', bottom: 0, right: 0 }}
          />
        </BoxAction>
      </Actions>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,.4)']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '50%',
        }}
      />
    </>
  );
};

export default Feed;
