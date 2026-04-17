import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface InputProps extends TextInputProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  error?: string;
  isPassword?: boolean;
}

export function Input({ icon, error, isPassword = false, style, ...rest }: InputProps) {
  const [isSecure, setIsSecure] = useState(isPassword);

  const toggleSecure = () => setIsSecure((prev) => !prev);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, error ? styles.containerError : null]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? theme.colors.error : theme.colors.textLight}
            style={styles.icon}
          />
        )}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.textLight}
          secureTextEntry={isSecure}
          accessibilityLabel={rest.placeholder}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={toggleSecure}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isSecure ? 'Mostrar senha' : 'Ocultar senha'}
            accessibilityRole="button"
          >
            <Ionicons
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: theme.colors.background,
  },
  containerError: {
    borderColor: theme.colors.error,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    height: '100%',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
