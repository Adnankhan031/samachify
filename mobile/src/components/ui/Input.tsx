import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, MIN_TOUCH } from '@/theme';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  /** Shown under the field when there is no error. */
  hint?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  secureTextEntry?: boolean;
  maxLength?: number;
  multiline?: boolean;
  editable?: boolean;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * The app's only text field. Errors are rendered inline and announced, never as an
 * alert — an alert loses the connection between the message and the field.
 */
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
  textContentType,
  secureTextEntry = false,
  maxLength,
  multiline = false,
  editable = true,
  returnKeyType,
  onSubmitEditing,
  style,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isPassword = secureTextEntry;
  const hidden = isPassword && !revealed;

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
          !editable && styles.fieldDisabled,
          multiline && styles.fieldMultiline,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedLight}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          secureTextEntry={hidden}
          maxLength={maxLength}
          multiline={multiline}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          style={[styles.input, multiline && styles.inputMultiline]}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setRevealed((r) => !r)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            style={({ pressed }) => [styles.reveal, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.revealText}>{revealed ? 'Hide' : 'Show'}</Text>
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink80,
    marginBottom: spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH + 4,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
  },
  fieldMultiline: { alignItems: 'flex-start', paddingVertical: spacing.md },
  fieldFocused: { borderColor: colors.green600 },
  fieldError: { borderColor: colors.danger },
  fieldDisabled: { backgroundColor: colors.cream2, opacity: 0.7 },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    // Android adds its own vertical padding that makes fields uneven.
    paddingVertical: spacing.md,
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  reveal: { paddingLeft: spacing.md },
  revealText: { fontSize: 13, fontWeight: '700', color: colors.green700 },
  error: { marginTop: 6, fontSize: 12, fontWeight: '600', color: colors.danger },
  hint: { marginTop: 6, fontSize: 12, color: colors.muted },
});
