# Getting Started

Hello! 👋 This tutorial will help you get started with the **Avatar SDK for React**.

## Table of Contents

- [Getting Started](#getting-started)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Importing and Initializing](#importing-and-initializing)
      - [Available Options](#available-options)
    - [Integrating with React](#integrating-with-react)
    - [Using Avatar Components](#using-avatar-components)
  - [Examples](#examples)

## Installation

**Note: Installation will be available soon.**

To install the package, run the following command:

```bash
npm i alpha-ai-avatar-sdk-react
```

## Usage

### Importing and Initializing

To get started, initialize an `AvatarClient` instance. First, import the necessary components from the SDK in your `index.jsx`:

```javascript
import { AvatarProvider, AvatarClient } from 'alpha-ai-avatar-sdk-react';
```

Next, initialize `AvatarClient` with your configuration. Replace `"YOUR_API_KEY"` with the API key provided by our team:

```javascript
const client = new AvatarClient({
  apiKey: 'YOUR_API_KEY',
  // Optional: Customize base URL for staging
  baseUrl: 'https://staging.avatar.alpha.school',
  // Optional: Pre-select an avatar by ID
  avatarId: 1,
});
```

#### Available Options

- `apiKey` (required): Your API key for authentication.
- `baseUrl` (optional): URL for using a staging environment. Default is the production URL.
- `avatarId` (optional): ID of the avatar to initialize.

### Integrating with React

Wrap your React app with `AvatarProvider` to ensure all components can access the avatar data. This is typically done in your `index.jsx`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AvatarProvider, AvatarClient } from 'alpha-ai-avatar-sdk-react';
import App from './App';

const client = new AvatarClient({
  apiKey: 'YOUR_API_KEY',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AvatarProvider client={client}>
    <App />
  </AvatarProvider>,
);
```

### Using Avatar Components

In your main app component (`App.tsx`), you can use the `Avatar` component and `useAvatarClient` hook to interact with the avatar:

```javascript
import { Avatar, useAvatarClient } from 'alpha-ai-avatar-sdk-react';

function App() {
  const client = useAvatarClient();

  return (
    <div>
      <Avatar style={{ borderRadius: '20px', width: 250, height: 250 }} />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type='button'
          onClick={() => client.sendMessage('Hello, how are you?')}>
          Send Message
        </button>
        <button type='button' onClick={() => client.stop()}>
          Stop Avatar
        </button>
        <button type='button' onClick={() => client.switchAvatar(4)}>
          Switch Avatar
        </button>
      </div>
    </div>
  );
}

export default App;
```

## Examples

You can find a simple example application in the `examples` folder of the library. This example demonstrates how to configure and use the SDK in a React project.

---

**Note:** Always ensure you keep your API key secure and do not expose it in publicly accessible code.

Congratulations! You have successfully integrated the Avatar SDK into your React app. 🎉 Feel free to experiment and build more complex components with avatars.
