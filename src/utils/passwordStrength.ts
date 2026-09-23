export type PasswordStrength =
  | 'FRACA'
  | 'MÉDIA'
  | 'FORTE'
  | 'MUITO FORTE';

type StrengthResult = {
  label: PasswordStrength;
  level: number;
};

export function calculatePasswordStrength(
  length: number,
  activeOptions: number
): StrengthResult {
  let score = 0;

  // Pontuação pelo tamanho
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;
  if (length >= 24) score += 1;

  // Pontuação pela variedade
  if (activeOptions >= 2) score += 1;
  if (activeOptions >= 3) score += 1;
  if (activeOptions === 4) score += 1;

  if (score <= 2) {
    return {
      label: 'FRACA',
      level: 1,
    };
  }

  if (score <= 4) {
    return {
      label: 'MÉDIA',
      level: 2,
    };
  }

  if (score <= 6) {
    return {
      label: 'FORTE',
      level: 3,
    };
  }

  return {
    label: 'MUITO FORTE',
    level: 4,
  };
}