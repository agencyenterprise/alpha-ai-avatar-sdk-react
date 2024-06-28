import { RoomEvent, Track } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';

import type { RemoteTrack } from 'livekit-client';
import { useAvatar } from './useAvatar';

export function useWebAvatar() {
  const avatar = useAvatar();
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [canPlaybackAudio, setCanPlaybackAudio] = useState(true);
  const { room } = avatar;

  useEffect(() => {
    if (!room) {
      return;
    }

    function handleTrackSubscribed(track: RemoteTrack) {
      if (track.kind === Track.Kind.Video) {
        track.attach(videoRef.current!);
      } else if (
        audioRef &&
        track.kind === Track.Kind.Audio &&
        room?.canPlaybackAudio
      ) {
        track.attach(audioRef.current!);
      }
    }

    function handleAudioPlaybackStatusChanged() {
      setCanPlaybackAudio(room?.canPlaybackAudio ?? false);
    }

    function handleTrackUnsubscribed(track: RemoteTrack) {
      track.detach();
    }

    room
      .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
      .on(RoomEvent.AudioPlaybackStatusChanged, handleAudioPlaybackStatusChanged)

    return () => {
      room
        .off(RoomEvent.TrackSubscribed, handleTrackSubscribed)
        .off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
        .off(RoomEvent.AudioPlaybackStatusChanged, handleAudioPlaybackStatusChanged);
    }
  }, [room]);

  return { ...avatar, videoRef, audioRef, canPlaybackAudio };
}
