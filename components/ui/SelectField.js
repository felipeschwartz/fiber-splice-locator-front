import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme';

// Campo do tipo "selecione uma opção", com rótulo e lista expansível.
// `options` é [{ value, label }]; `onChange` recebe o `value` escolhido.
export default function SelectField({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable style={styles.control} onPress={() => setOpen((current) => !current)}>
        <Text style={styles.controlText}>{selected?.label ?? value}</Text>
        <Text style={styles.chevron}>⌄</Text>
      </Pressable>

      {open ? (
        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
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
  control: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlText: { color: colors.textTitle, fontSize: fontSize.md },
  chevron: { color: colors.primary, fontSize: fontSize.xxl },
  options: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  option: {
    padding: spacing.md + 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  optionText: { color: colors.textBody, fontWeight: fontWeight.medium },
});
