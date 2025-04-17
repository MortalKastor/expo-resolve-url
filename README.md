# expo-resolve-url

Native module for React Native or Expo to get the destination URL of a redirect link (like marketing or shortened links) without following it, on iOS and Android.

## Rationale

Because of the way the HTTP stack is exposed in React Native, there is no way to call un URL and _not_ follow any redirect in JS.
This can be an issue when you just want to know the _destination URL_, but don't care about the destination _content_.

## Limitations

- Only works for HTTP redirects (`3XX` codes).
- Super bare-bones: returns the `location` header of the response or, if it can't (for any reason), throws an error.

## Installation

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your dependencies

#### npm

```
npm install expo-resolve-url
```

#### yarn

```
yarn add expo-resolve-url
```

#### pnpm

```
pnpm install expo-resolve-url
```

### Configure pods

Run `npx pod-install` after installing the package.

## Usage

```tsx
import ResolveUrl from "expo-resolve-url";
import React from "react";
import { Button, SafeAreaView, Text, TextInput } from "react-native";

export default function App() {
  const [url, setUrl] = React.useState<string>("");
  const [result, setResult] = React.useState<string | null>(null);

  return (
    <SafeAreaView>
      <TextInput
        placeholder="Enter URL"
        onChangeText={(text) => setUrl(text)}
        value={url}
      />
      <Button
        title="Result"
        onPress={async () => {
          try {
            const result = await ResolveUrl.resolve(url);
            setResult(result);
          } catch (error) {
            //
            // Any case but a valid URL returning a valid HTTP redirect will end up here
            //
            console.error(error);
            const message =
              error instanceof Error ? error.message : "An error occurred";
            setResult(message);
          }
        }}
      />
      <Text>{result}</Text>
    </SafeAreaView>
  );
}
```
