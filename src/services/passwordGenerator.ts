const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%&*_-+=?';

export type PasswordOptions = {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

function getRandomCharacter(characters: string): string {
  const randomIndex = Math.floor(
    Math.random() * characters.length
  );

  return characters[randomIndex];
}

function shufflePassword(characters: string[]): string {
  const shuffledCharacters = [...characters];

  for (let i = shuffledCharacters.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [
      shuffledCharacters[i],
      shuffledCharacters[randomIndex],
    ] = [
      shuffledCharacters[randomIndex],
      shuffledCharacters[i],
    ];
  }

  return shuffledCharacters.join('');
}

export function generatePassword({
  length,
  lowercase,
  uppercase,
  numbers,
  symbols,
}: PasswordOptions): string {
  const selectedCharacterSets: string[] = [];

  if (lowercase) {
    selectedCharacterSets.push(LOWERCASE);
  }

  if (uppercase) {
    selectedCharacterSets.push(UPPERCASE);
  }

  if (numbers) {
    selectedCharacterSets.push(NUMBERS);
  }

  if (symbols) {
    selectedCharacterSets.push(SYMBOLS);
  }

  // Segurança extra caso nenhuma opção esteja selecionada
  if (selectedCharacterSets.length === 0) {
    return '';
  }

  const allCharacters = selectedCharacterSets.join('');

  const passwordCharacters: string[] = [];

  // Garante pelo menos um caractere de cada categoria selecionada
  selectedCharacterSets.forEach((characterSet) => {
    passwordCharacters.push(
      getRandomCharacter(characterSet)
    );
  });

  // Completa o restante da senha usando todas as categorias selecionadas
  while (passwordCharacters.length < length) {
    passwordCharacters.push(
      getRandomCharacter(allCharacters)
    );
  }

  // Embaralha para os caracteres obrigatórios não ficarem sempre no início
  return shufflePassword(passwordCharacters);
}