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

export default function Login() {
  const router = useRouter();
  const { signIn, resetPassword } = useAuth();
  // Set by /checkout so signing in returns you to the order you were placing.
  const { next } = useLocalSearchParams<{ next?: string }>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError(null);

    const result = await signIn(email, password);

    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (next === 'checkout') router.replace('/checkout');
    else if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  const forgot = async () => {
    if (!email.trim()) {
      setError('Enter your email above first, then tap Forgot password.');
      return;
    }
    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
      return;
    }
    Alert.alert(
      'Check your email',
      `${result.message ?? ''}\n\nThe reset link opens on samachify.in. Come back here to sign in once it's done.`.trim()
    );
  };

  return (
    <Screen>
      <ScreenHeader title="Welcome back" />

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
            Sign in to track orders and save addresses. The same account works on
            samachify.in.
          </Text>

          {error ? <ErrorBanner message={error} /> : null}

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
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={() => void submit()}
          />

          <Pressable
            onPress={() => void forgot()}
            hitSlop={8}
            accessibilityRole="button"
            style={({ pressed }) => [styles.forgot, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <Button
            label="Sign in"
            size="lg"
            fullWidth
            loading={busy}
            onPress={() => void submit()}
            style={styles.submit}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Pressable
              onPress={() => router.replace(next ? `/signup?next=${next}` : '/signup')}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.footerLink}>Sign up</Text>
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
  forgot: { alignSelf: 'flex-end', marginTop: -spacing.sm, marginBottom: spacing.lg },
  forgotText: { ...type.small, fontWeight: '700', color: colors.leaf },
  submit: { marginTop: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl },
  footerText: { ...type.small, color: colors.muted },
  footerLink: { ...type.small, fontWeight: '800', color: colors.leaf },
});
