import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme';

// Campo de formulário padrão: label + input, com o visual (borda,
// raio, cor) definido em um único lugar. Quando `secureTextEntry` é
// passado, ganha automaticamente um botão de mostrar/ocultar a senha.
export default function TextField({
  label,
  multiline = false,
  secureTextEntry = false,
  style,
  inputStyle,
  ...inputProps
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={colors.placeholder}
          multiline={multiline}
          secureTextEntry={secureTextEntry && !visible}
          style={[styles.input, multiline && styles.multiline, secureTextEntry && styles.inputWithToggle, inputStyle]}
          {...inputProps}
        />

        {secureTextEntry ? (
          <Pressable onPress={() => setVisible((current) => !current)} style={styles.toggle} hitSlop={8}>
            <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.extrabold,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  inputWrapper: { justifyContent: 'center' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.textTitle,
    fontSize: fontSize.md,
  },
  inputWithToggle: { paddingRight: spacing.xxl + spacing.sm },
  multiline: {
    minHeight: 120,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  toggle: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
});
