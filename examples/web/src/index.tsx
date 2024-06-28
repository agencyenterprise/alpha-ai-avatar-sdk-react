import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

import { AvatarClient, AvatarProvider } from 'alpha-ai-avatar-sdk-react';

const client = new AvatarClient({ apiKey: 'YOUR_API_KEY' });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <AvatarProvider client={client}>
      <App />
    </AvatarProvider>
  </React.StrictMode>,
);
