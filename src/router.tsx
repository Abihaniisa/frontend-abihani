import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Feed } from './screens/Feed';
import { Discover } from './screens/Discover';
import { Orders } from './screens/Orders';
import { Thread } from './screens/Thread';
import { Profile } from './screens/Profile';
import { Create } from './screens/Create';
import { Settings } from './screens/Settings';
import { Admin } from './screens/Admin';
import { Support } from './screens/Support';
import { Signup } from './screens/Signup';
import { Splash } from './screens/Splash';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/thread" element={<Thread />} />
      <Route path="/thread/:orderId" element={<Thread />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<Create />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/support" element={<Support />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/splash" element={<Splash />} />
      {/* Catch-all redirect to Feed */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
