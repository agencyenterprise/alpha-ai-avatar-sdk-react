import { useContext } from 'react';
import { AvatarContext } from '../contexts/AvatarContext';

export const useAvatar = () => useContext(AvatarContext);
