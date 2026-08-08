import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button, ErrorBanner, Input, Screen, ScreenHeader } from '@/components/ui';
import { useAuth } from '@/store/auth';
import { colors, spacing, type } from '@/theme';

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { next } = useLocalSearchParams<{ next?: string }>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);

    const result = await signUp(name, email, password, phone);

    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    // Email confirmation is on: there's no session yet, so send them to sign in.
    if (result.message) {
      Alert.alert('Almost there', result.message, [
        { text: 'OK', onPress: () => router.replace(next ? `/login?next=${next}` : '/login') },
      ]);
      return;
    }

    if (next === 'checkout') router.replace('/checkout');
    else router.replace('/(tabs)');
  };

  return (
    <Screen>
      <ScreenHeader title="Create account" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.lede}>
            One account for the Samachify app and website — your orders and addresses
            follow you between them.
          </Text>

          {error ? <ErrorBanner message={error} /> : null}

          <Input
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />

          <Input
            label="Mobile number"
            value={phone}
            onChangeText={(v) => setPhone(v.replace(/\D/g, ''))}
            placeholder="10-digit number"
            keyboardType="number-pad"
            maxLength={10}
            autoComplete="tel"
            hint="Optional now — we'll ask for it at checkout."
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            hint="Minimum 8 characters."
            returnKeyType="go"
            onSubmitEditing={() => void submit()}
          />

          <Button
            label="Create account"
            size="lg"
            fullWidth
            loading={busy}
            onPress={() => void submit()}
            style={styles.submit}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable
              onPress={() => router.replace(next ? `/login?next=${next}` : '/login')}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.footerLink}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.section },
  lede: { ...type.body, color: colors.muted, marginBottom: spacing.xxl, lineHeight: 21 },
  submit: { marginTop: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl },
  footerText: { ...type.small, color: colors.muted },
  footerLink: { ...type.small, fontWeight: '800', color: colors.green700 },
});
