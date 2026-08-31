import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius } from '../../theme';

// Ícone de casinha presente em todo cabeçalho (HeroHeader/PageHeader),
// para voltar à tela inicial em um toque. `navigate` (em vez de
// `goBack` várias vezes) volta direto para a instância de "Welcome"
// que já existe na pilha.
export default function HomeButton({ tone = 'dark' }) {
  const navigation = useNavigation();
  const color = tone === 'dark' ? colors.onDarkTitle : colors.primary;

  return (
    <Pressable
      onPress={() => navigation.navigate('Welcome')}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name="home-outline" size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 4, borderRadius: radius.sm },
  pressed: { opacity: 0.6 },
});
