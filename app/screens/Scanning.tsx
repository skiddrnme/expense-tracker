import React from "react";


import { useEffect, useState } from "react";
import { CameraView, Camera } from "expo-camera/next";
import { Button, StyleSheet, Text, View } from "react-native";
export const Scanning = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [scannedText, setScannedText] = useState<string>("Еще не отсканировано");
  const askCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
  };

  const handleAfterScanned = ({ data, type }: any) => {
    setHasScanned(true);
    const parameters = data.split("&");
    const decodedData = {};
    parameters.forEach((parameter) => {
      const [key, value] = parameter.split("=");
      decodedData[key] = value;
    });

    const scannedText = `Time: ${decodedData.t}, Price: ${decodedData.s}, FN: ${decodedData.fn}, Invoice: ${decodedData.i}, FP: ${decodedData.fp}, Number: ${decodedData.n}`;
    setScannedText(scannedText);
    
    
    navigation.navigate('Добавить', { amountScan: decodedData.s, dateScan: decodedData.t });
  };
  useEffect(() => {
    askCameraPermission();
  }, []);

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30 }}>Permission denied</Text>
        <Button title="Allow Camera" onPress={askCameraPermission} />
      </View>
    );
  }
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 30 }}>Requesting camera Permission</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={hasScanned ? undefined : handleAfterScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      {hasScanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setHasScanned(false)} />
      )}
      {/* <Text style={{ fontSize: 30 }}>{scannedText}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Scanner: {
    width: "70%",
    height: "50%",
    backgroundColor: "black",
  },
});
