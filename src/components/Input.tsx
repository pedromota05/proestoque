import React, { forwardRef, useState } from 'react';
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
  error?: string | boolean;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ icon, error, isPassword = false, style, multiline, onFocus, onBlur, ...rest }, ref) => {
    const [isSecure, setIsSecure] = useState(isPassword);
    const [isFocused, setIsFocused] = useState(false);

    const toggleSecure = () => setIsSecure((prev) => !prev);

    return (
      <View style={styles.wrapper}>
        <View
          style={[
            styles.container,
            isFocused && !error && styles.containerFocused,
            error ? styles.containerError : null,
            multiline && styles.containerMultiline,
          ]}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={error ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textLight}
              style={[styles.icon, multiline && { alignSelf: 'flex-start', marginTop: 14 }]}
            />
          )}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              { outlineStyle: 'none' as any },
              multiline && styles.inputMultiline,
              style,
            ]}
            placeholderTextColor={theme.colors.textLight}
            secureTextEntry={isSecure}
            accessibilityLabel={rest.placeholder}
            multiline={multiline}
            onFocus={(e) => {
              setIsFocused(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
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

        {typeof error === 'string' && error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

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
  containerFocused: {
    borderColor: theme.colors.primary,
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
  containerMultiline: {
    height: 'auto' as any,
    minHeight: 100,
    alignItems: 'flex-start',
  },
  inputMultiline: {
    height: 'auto' as any,
    minHeight: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
