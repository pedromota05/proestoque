import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../constants/theme';

interface ImagePickerFieldProps {
  value: string | null;
  onChange: (uri: string | null) => void;
}

export function ImagePickerField({ value, onChange }: ImagePickerFieldProps) {
  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à câmera para tirar fotos.',
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à galeria para selecionar fotos.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  }

  function handlePress() {
    if (Platform.OS === 'web') {
      // Na web, ir direto para galeria (câmera não é suportada da mesma forma)
      pickFromGallery();
      return;
    }

    const options: Array<{
      text: string;
      onPress?: () => void;
      style?: 'cancel' | 'destructive' | 'default';
    }> = [
      { text: 'Câmera', onPress: pickFromCamera },
      { text: 'Galeria', onPress: pickFromGallery },
    ];

    if (value) {
      options.push({
        text: 'Remover foto',
        style: 'destructive',
        onPress: () => onChange(null),
      });
    }

    options.push({ text: 'Cancelar', style: 'cancel' });

    Alert.alert('Foto do produto', 'Escolha uma opção:', options);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.container}
    >
      {value ? (
        <Image
          source={{ uri: value }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons
            name="camera-outline"
            size={32}
            color={theme.colors.textLight}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
