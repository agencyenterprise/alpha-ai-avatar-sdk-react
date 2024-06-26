import { useEffect } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';

import type { RemoteTrack } from 'livekit-client';

export type UseLiveKitRoomOptions = {
  room: Room | undefined;
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
};

export function useLiveKitRoom({
  room,
  videoRef,
  audioRef,
}: UseLiveKitRoomOptions) {
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

    function handleTrackUnsubscribed(track: RemoteTrack) {
      track.detach();
    }

    room
      .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
  }, [room, audioRef, videoRef]);
}
