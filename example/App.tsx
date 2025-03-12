import ResolveUrl from "expo-resolve-url";
import React from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function App() {
  const [url, setUrl] = React.useState<string>("");
  const [result, setResult] = React.useState<string | null>(null);
  const [time, setTime] = React.useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>expo-resolve-url</Text>
        <Group name="Resolve URL">
          <TextInput
            placeholder="Enter URL"
            onChangeText={(text) => setUrl(text)}
            value={url}
          />
          <Button
            title="RESOLVE"
            onPress={async () => {
              const startTime = performance.now();
              try {
                const result = await ResolveUrl.resolve(url);
                setTime(performance.now() - startTime);
                setResult(result);
              } catch (error) {
                setTime(performance.now() - startTime);
                console.error(error);
                const message =
                  error instanceof Error ? error.message : "An error occurred";
                setResult(message);
              }
            }}
          />
        </Group>
        <Group name="Result">
          <Text>{result}</Text>
        </Group>
        <Group name="Time">
          {time != null ? <Text>{time.toFixed(2)}ms</Text> : null}
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
};
