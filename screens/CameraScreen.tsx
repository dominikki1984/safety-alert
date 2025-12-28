import React, { useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/navigation";
import { addRecent } from "../services/storage";

type Props = NativeStackScreenProps<RootStackParamList, "Camera">;

type Facing = "back" | "front";

export function CameraScreen({ navigation }: Props) {
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaPerm, setHasMediaPerm] = useState<boolean | null>(null);

  const [facing, setFacing] = useState<Facing>("back");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const media = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPerm(media.status === "granted");
    })();
  }, []);

  async function takePhoto() {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!photo?.uri) {
        Alert.alert("Błąd", "Nie udało się zrobić zdjęcia.");
        return;
      }
      setPhotoUri(photo.uri);
    } catch {
      Alert.alert("Błąd", "Nie udało się zrobić zdjęcia.");
    }
  }

  async function savePhoto() {
    if (!photoUri) return;

    try {
      if (hasMediaPerm) {
        await MediaLibrary.createAssetAsync(photoUri);
      }

      await addRecent({
        id: String(Date.now()),
        type: "PHOTO",
        timestamp: Date.now(),
        title: "Zrobiono zdjęcie",
        detail: hasMediaPerm ? "Zapisano w galerii" : "Brak dostępu do galerii (tylko URI)",
      });

      Alert.alert("Gotowe", "Zdjęcie zapisane.");
      navigation.goBack();
    } catch {
      Alert.alert("Błąd", "Nie udało się zapisać zdjęcia.");
    }
  }

  // --- Uprawnienia kamery ---
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Sprawdzam uprawnienia…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>Brak uprawnień do aparatu.</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={requestPermission}>
          <Text style={styles.btnPrimaryText}>Nadaj uprawnienia</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Podgląd zdjęcia ---
  if (photoUri) {
    return (
      <View style={styles.previewWrap}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <View style={styles.previewBar}>
          <TouchableOpacity style={[styles.btn, styles.btnAlt]} onPress={() => setPhotoUri(null)}>
            <Text style={styles.btnText}>Powtórz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnMain]} onPress={savePhoto}>
            <Text style={styles.btnText}>Zapisz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Kamera ---
  return (
    <View style={styles.wrap}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      <View style={styles.bar}>
        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        >
          <Text style={styles.smallBtnText}>Odwróć</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shutter} onPress={takePhoto} />

        <View style={{ width: 110 }}>
          <Text style={styles.note}>{hasMediaPerm ? "Zapis do galerii" : "Brak dostępu do galerii"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },

  bar: {
    height: 110,
    backgroundColor: "rgba(0,0,0,0.9)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 18,
  },

  shutter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    borderColor: "white",
  },

  smallBtn: {
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  smallBtnText: { color: "white", fontWeight: "800" },

  note: { color: "#d1d5db", fontSize: 12, textAlign: "right" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 18 },
  err: { fontWeight: "900", marginBottom: 10, color: "white" },

  btnPrimary: { backgroundColor: "#111827", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14 },
  btnPrimaryText: { color: "white", fontWeight: "900" },

  previewWrap: { flex: 1, backgroundColor: "black" },
  preview: { flex: 1, resizeMode: "contain" },
  previewBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.9)",
    gap: 12,
  },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  btnMain: { backgroundColor: "#111827" },
  btnAlt: { backgroundColor: "#374151" },
  btnText: { color: "white", fontWeight: "900" },
});
