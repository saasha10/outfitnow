import { StyleSheet, Text, View } from 'react-native';

import { COLORS, SPACING, FONT_SIZE } from '@constants/index';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OutfitNow</Text>
      <Text style={styles.subtitle}>Tu estilo, tu momento.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
  },
});
