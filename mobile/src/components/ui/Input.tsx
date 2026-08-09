import Ionicons from '@expo/vector-icons/Ionicons';
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

import { colors, radius, spacing, type, MIN_TOUCH } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface InputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  /** Shown under the field when there is no error. */
  hint?: string;
  icon?: IoniconName;
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
 * The app's only text field. Errors render inline and are announced — an alert
 * would break the link between the message and the field it belongs to.
 */
export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  icon,
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
  const hidden = secureTextEntry && !revealed;

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.field,
          focused && styles.focused,
          !!error && styles.errored,
          !editable && styles.disabled,
          multiline && styles.multilineField,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={17}
            color={focused ? colors.leaf : colors.faint}
            style={styles.icon}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.faint}
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
          style={[styles.input, multiline && styles.multilineInput]}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setRevealed((r) => !r)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
            style={({ pressed }) => pressed && { opacity: 0.5 }}
          >
            <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={13} color={colors.chilli} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { ...type.smallStrong, color: colors.ink80, marginBottom: spacing.sm },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH + 6,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  multilineField: { alignItems: 'flex-start', paddingVertical: spacing.md },
  focused: { borderColor: colors.leaf, backgroundColor: colors.paper },
  errored: { borderColor: colors.chilli },
  disabled: { backgroundColor: colors.cream2, opacity: 0.75 },
  icon: { marginRight: spacing.md },
  input: {
    flex: 1,
    ...type.bodyMed,
    color: colors.ink,
    paddingVertical: spacing.md,
    // Android pads custom fonts vertically; this keeps fields the same height.
    includeFontPadding: false,
  },
  multilineInput: { minHeight: 84, textAlignVertical: 'top' },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  error: { ...type.tiny, color: colors.chilli, flex: 1 },
  hint: { ...type.tiny, color: colors.muted, marginTop: 6 },
});
