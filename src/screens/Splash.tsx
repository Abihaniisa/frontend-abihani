import React from 'react';
import { Splash as SplashComponent } from '../components/Splash';
import { useUIStore } from '../store/ui.store';

export const Splash: React.FC = () => {
  const { navigate } = useUIStore();

  return <SplashComponent onComplete={() => navigate('home')} />;
};

export default Splash;
