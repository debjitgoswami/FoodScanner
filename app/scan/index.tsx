import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (permission?.status !== "granted") {
      requestPermission();
    }
  }, [permission?.status]);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: BarcodeScanningResult) => {
    setScanned(true);
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );

      // Check if response is valid JSON before parsing
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API did not return JSON");
      }

      const json = await res.json();

      if (json.status === 1 && json.product) {
        router.push(`/detail/${data}`);
      } else {
        setErrorMsg("Product not found");
        setTimeout(() => setScanned(false), 3000); // Auto-rescan after 3s
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setErrorMsg("Network error. Please try again.");
      setTimeout(() => setScanned(false), 3000); // Auto-rescan after 3s
    }

    setLoading(false);
  };

  const toggleCameraFacing = () => {
    setFacing(facing === "back" ? "front" : "back");
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button
          onPress={requestPermission}
          color={Colors.primary}
          title="Grant Permission 📸"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
      >
        <View style={styles.overlay}>
          {/* Scanner guide overlay */}
          <View style={styles.scannerGuide} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loaderText}>Searching product...</Text>
        </View>
      )}

      {/* Error message */}
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* Bottom buttons */}
      <View style={styles.bottomButtons}>
        {scanned && !loading && (
          <Button
            title="Scan Again"
            onPress={() => {
              setScanned(false);
              setErrorMsg(null);
            }}
            color={Colors.primary}
          />
        )}
        <View style={{ height: 10 }} />
        <Button
          title="Search manually"
          onPress={() => router.push("/scan/search")}
          color={Colors.secondary || Colors.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerGuide: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  bottomButtons: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loaderText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    backgroundColor: "rgba(255,0,0,0.7)",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});