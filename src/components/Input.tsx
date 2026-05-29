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
import { useTheme } from '../contexts/ThemeContext';
import { ThemeColors } from '../constants/theme';

interface InputProps extends TextInputProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  error?: string | boolean;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ icon, error, isPassword = false, style, multiline, onFocus, onBlur, ...rest }, ref) => {
    const { colors } = useTheme();
    const s = React.useMemo(() => styles(colors), [colors]);
    const [isSecure, setIsSecure] = useState(isPassword);
    const [isFocused, setIsFocused] = useState(false);

    const toggleSecure = () => setIsSecure((prev) => !prev);

    return (
      <View style={s.wrapper}>
        <View
          style={[
            s.container,
            isFocused && !error && s.containerFocused,
            error ? s.containerError : null,
            multiline && s.containerMultiline,
          ]}
        >
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={error ? colors.error : isFocused ? colors.primary : colors.textLight}
              style={[s.icon, multiline && { alignSelf: 'flex-start', marginTop: 14 }]}
            />
          )}

          <TextInput
            ref={ref}
            style={[
              s.input,
              { outlineStyle: 'none' as any },
              multiline && s.inputMultiline,
              style,
            ]}
            placeholderTextColor={colors.textLight}
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
                color={colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>

        {typeof error === 'string' && error ? <Text style={s.errorText}>{error}</Text> : null}
      </View>
    );
  }
);

const styles = (colors: ThemeColors) => StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: colors.background,
  },
  containerError: {
    borderColor: colors.error,
  },
  containerFocused: {
    borderColor: colors.primary,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
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
    color: colors.error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});
