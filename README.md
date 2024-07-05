# Getting Started

[![npm version](https://badge.fury.io/js/alpha-ai-avatar-sdk-react.svg)](https://badge.fury.io/js/alpha-ai-avatar-sdk-react)

Hello! 👋 This tutorial will help you get started with the **Avatar SDK for React**.

## Table of Contents

- [Getting Started](#getting-started)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Importing and Initializing](#importing-and-initializing)
      - [Available Options](#available-options)
    - [Integrating with React](#integrating-with-react)
    - [Connecting to the Avatar](#connecting-to-the-avatar)
    - [Showing and controlling the Avatar](#showing-and-controlling-the-avatar)
  - [Plugins](#plugins)
  - [Examples](#examples)
  - [Documentation](#documentation)

## Installation

To install the package, run the following command:

```bash
npm i alpha-ai-avatar-sdk-react
```

## Usage

### Importing and Initializing

To get started, first import the necessary components from the SDK:

```javascript
import { AvatarProvider, AvatarClient } from 'alpha-ai-avatar-sdk-react';
```

Next, initialize `AvatarClient` with your configuration. Replace `YOUR_API_KEY` with the API key provided by our team:

```javascript
const client = new AvatarClient({ apiKey: 'YOUR_API_KEY' });
```

#### Available Options

- `apiKey` (required): Your API key for authentication.
- `baseUrl` (optional): Send `'https://staging.avatar.alpha.school'` to use the staging environment. Defaults to the production URL.

### Integrating with React

Wrap your React app with `AvatarProvider` to ensure all components can access the avatar data:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AvatarProvider, AvatarClient } from 'alpha-ai-avatar-sdk-react';
import App from './App';

const client = new AvatarClient({ apiKey: 'YOUR_API_KEY' });

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AvatarProvider client={client}>
    <App />
  </AvatarProvider>,
);
```

### Connecting to the Avatar

To connect to the avatar, use the `connect` method. We recommend only calling this method after the user has interacted with the page. Calling it before may result in issues with audio playback.

```javascript
const { connect } = useAvatar();

function handleClick() {
  connect().then(() => {
    console.log('Connected to the avatar!');
  });
}
```

### Showing and controlling the Avatar

Use the `Avatar` component and `useAvatar` hook to interact with the avatar:

```javascript
import { Avatar, useAvatar } from 'alpha-ai-avatar-sdk-react';

function App() {
  const { say, stop, switchAvatar } = useAvatar();

  return (
    <div>
      <Avatar style={{ borderRadius: '20px', width: 250, height: 250 }} />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type='button' onClick={() => say('Hello, how are you?')}>
          Send Message
        </button>
        <button type='button' onClick={stop}>
          Stop Avatar
        </button>
        <button type='button' onClick={() => switchAvatar(4)}>
          Switch Avatar
        </button>
      </div>
    </div>
  );
}

export default App;
```

## Plugins

You can explore our comprehensive list of plugins supported within the Avatar SDK to streamline and accelerate your application development process. For detailed information about each plugin, refer to our [plugins documentation](docs/plugins).

## Examples

You can find a few examples in the [examples](examples/) folder of the library. These examples demonstrates how to configure and use the SDK in a React project.

## Documentation

For a detailed overview of all supported configurations, please refer to our comprehensive [documentation](docs/).

---

**Note:** Always ensure you keep your API key secure and do not expose it in publicly accessible code.

Congratulations! You have successfully integrated the Avatar SDK into your React app. 🎉 Feel free to experiment and build more complex components with avatars.
