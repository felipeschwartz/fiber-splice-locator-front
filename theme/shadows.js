import { colors } from './colors';

// Sombra padrão para cards elevados. `elevation` cobre Android,
// as demais propriedades cobrem iOS.
export const cardShadow = {
  shadowColor: colors.textTitle,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 2,
};
