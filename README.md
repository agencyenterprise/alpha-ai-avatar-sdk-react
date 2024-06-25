# Getting Started

Hello! 👋 This short tutorial gets you up and running with Avatar SDK (React)

## Installation (Soon)

Run the following command to install the package:

```bash
npm i alpha-ai-avatar-sdk-react
```

## How to use

With our dependency set up, we can now initialize an AvatarClient instance.

In `index.jsx`, let's first import the symbols we need from `alpha-ai-avatar-sdk-react`:

```javascript
import { AvatarProvider, AvatarClient } from "alpha-ai-avatar-sdk-react";
```

Next we'll initialize AvatarClient, passing its constructor a configuration object with the apiKey:

```javascript
const client = new AvatarClient({
  apiKey: "YOUR_API_KEY",
});
```

- `apiKey` is provided by our team to you.
- `baseUrl` in case you want to use staging for testing purposes.
- `avatarId` if you want to initialize with an specific avatar.

Let's wrap our React app with an `AvatarProvider`. We suggest putting the `AvatarProvider` somewhere high in your app, above any component that might need to access the avatar data.

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import { AvatarProvider, AvatarClient } from "alpha-ai-avatar-sdk-react";
import App from "./App";

const client = new AvatarClient({
  apiKey: "YOUR_API_KEY",
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <AvatarProvider client={client}>
    <App />
  </AvatarProvider>
);
```

In your `App.tsx` call the `Avatar` component and `useAvatarClient` hook to access all the features available.

```javascript
import { Avatar, useAvatarClient } from "alpha-ai-avatar-sdk-react";

function App() {
  const client = useAvatarClient();

  return (
    <div>
      <Avatar style={{ borderRadius: "20px", width: 250, height: 250 }} />

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="button" onClick={() => client.say("Hello, how are you?")}>
          Say
        </button>
        <button type="button" onClick={() => client.stop()}>
          Stop Avatar
        </button>
        <button type="button" onClick={() => client.switchAvatar(4)}>
          Switch Avatar
        </button>
      </div>
    </div>
  );
}

export default App;
```

Congrats, you just made your first component that renders an Avatar! 🎉 Now you can try building more components with an Avatar and experiment with the concepts you just learned.

## Examples

In the examples folder you can find a simple React application that has the library configured.
