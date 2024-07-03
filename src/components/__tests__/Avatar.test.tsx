/** @jest-environment jsdom */
import '@testing-library/jest-dom';

import { Avatar } from '../Avatar/Avatar';
import { render, screen } from '@testing-library/react';
import { useWebAvatar } from '../../hooks/useWebAvatar';

jest.mock('../../hooks/useWebAvatar');

describe('Avatar', () => {
  const mockVideoRef = { current: null };
  const mockAudioRef = { current: null };

  beforeEach(() => {
    (useWebAvatar as jest.Mock).mockReturnValue({
      videoRef: mockVideoRef,
      audioRef: mockAudioRef,
    });
  });

  it('render video element with correct props', () => {
    render(<Avatar />);

    const videoElement = screen.getByTestId('avatar-video');
    expect(videoElement).toBeInTheDocument();
    expect(videoElement.tagName).toBe('VIDEO');
    expect(videoElement).toHaveAttribute('autoplay');
    expect(videoElement).toHaveAttribute('playsinline');
  });

  it('render audio element with correct props', () => {
    render(<Avatar />);

    const audioElement = screen.getByTestId('avatar-audio');
    expect(audioElement).toBeInTheDocument();
    expect(audioElement.tagName).toBe('AUDIO');
    expect(audioElement).toHaveStyle({ display: 'none' });
    expect(audioElement).toHaveAttribute('autoplay');
  });

  it('passes additional props to the video element', () => {
    render(<Avatar width={640} height={480} />);

    const videoElement = screen.getByTestId('avatar-video');
    expect(videoElement).toHaveAttribute('width', '640');
    expect(videoElement).toHaveAttribute('height', '480');
  });

  it('uses refs from useWebAvatar hook', () => {
    render(<Avatar />);

    const videoElement = screen.getByTestId('avatar-video');
    const audioElement = screen.getByTestId('avatar-audio');

    expect(mockVideoRef.current).toBe(videoElement);
    expect(mockAudioRef.current).toBe(audioElement);
  });
});
