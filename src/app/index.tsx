import * as Clipboard from 'expo-clipboard';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { generatePassword } from '@/services/passwordGenerator';
import { calculatePasswordStrength } from '@/utils/passwordStrength';

type PasswordOptionKey =
  | 'uppercase'
  | 'lowercase'
  | 'numbers'
  | 'symbols';

export default function HomeScreen() {
  const [password, setPassword] = useState('G0tham#84!');
  const [passwordLength, setPasswordLength] = useState(16);
  const [copied, setCopied] = useState(false);

  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  const activeOptionsCount = [
    uppercase,
    lowercase,
    numbers,
    symbols,
  ].filter(Boolean).length;

  const progressPercentage =
    ((passwordLength - 8) / (32 - 8)) * 100;

  const strength = calculatePasswordStrength(
    passwordLength,
    activeOptionsCount
  );

  function increasePasswordLength() {
    setPasswordLength((currentLength) =>
      Math.min(currentLength + 1, 32)
    );
  }

  function decreasePasswordLength() {
    setPasswordLength((currentLength) =>
      Math.max(currentLength - 1, 8)
    );
  }

  function handleToggleOption(option: PasswordOptionKey) {
    const optionValues = {
      uppercase,
      lowercase,
      numbers,
      symbols,
    };

    const isCurrentlyActive = optionValues[option];

    // Impede que todas as opções sejam desativadas
    if (isCurrentlyActive && activeOptionsCount === 1) {
      return;
    }

    switch (option) {
      case 'uppercase':
        setUppercase((currentValue) => !currentValue);
        break;

      case 'lowercase':
        setLowercase((currentValue) => !currentValue);
        break;

      case 'numbers':
        setNumbers((currentValue) => !currentValue);
        break;

      case 'symbols':
        setSymbols((currentValue) => !currentValue);
        break;
    }

    setCopied(false);
  }

  function handleGeneratePassword() {
    const newPassword = generatePassword({
      length: passwordLength,
      lowercase,
      uppercase,
      numbers,
      symbols,
    });

    setPassword(newPassword);
    setCopied(false);
  }

  async function handleCopyPassword() {
    await Clipboard.setStringAsync(password);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
        {/* Identidade */}
        <View style={styles.header}>
          <View style={styles.brandIcon}>
            <View style={styles.wingLeft} />
            <View style={styles.wingRight} />

            <View style={styles.batCenter}>
              <Text style={styles.batLetter}>B</Text>
            </View>
          </View>

          <Text style={styles.title}>BATPASS</Text>

          <Text style={styles.subtitle}>
            GOTHAM SECURITY SYSTEM
          </Text>

          <View style={styles.status}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              PROTEÇÃO ATIVA
            </Text>
          </View>
        </View>

        {/* Introdução */}
        <View style={styles.intro}>
          <Text style={styles.introTag}>
            SEGURANÇA DIGITAL
          </Text>

          <Text style={styles.introTitle}>
            Sua senha.{'\n'}
            <Text style={styles.highlight}>
              Sua proteção.
            </Text>
          </Text>

          <Text style={styles.introDescription}>
            Gere combinações fortes e personalizadas em poucos segundos.
          </Text>
        </View>

        {/* Card principal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionLabel}>
                GERADOR DE SENHAS
              </Text>

              <Text style={styles.cardSubtitle}>
                Configure sua combinação
              </Text>
            </View>

            <View style={styles.secureBadge}>
              <Text style={styles.secureBadgeText}>
                SEGURO
              </Text>
            </View>
          </View>

          {/* Senha */}
          <View style={styles.passwordBox}>
            <View style={styles.passwordTop}>
              <Text style={styles.passwordLabel}>
                SENHA GERADA
              </Text>

              <View style={styles.passwordStatus}>
                <View style={styles.passwordStatusDot} />

                <Text style={styles.passwordStatusText}>
                  {copied ? 'COPIADA!' : 'PRONTA'}
                </Text>
              </View>
            </View>

            <View style={styles.passwordRow}>
              <Text
                style={styles.password}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {password}
              </Text>

              <Pressable
                onPress={handleCopyPassword}
                accessibilityRole="button"
                accessibilityLabel="Copiar senha"
                style={({ pressed }) => [
                  styles.copyButton,
                  copied && styles.copyButtonCopied,
                  pressed && styles.buttonPressed,
                ]}
              >
                {copied ? (
                  <Text style={styles.copiedIcon}>✓</Text>
                ) : (
                  <View style={styles.copyIcon}>
                    <View style={styles.copyBack} />
                    <View style={styles.copyFront} />
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Segurança dinâmica */}
          <View style={styles.securityHeader}>
            <View>
              <Text style={styles.optionTitle}>
                NÍVEL DE SEGURANÇA
              </Text>

              <Text style={styles.optionDescription}>
                Resistência estimada da senha
              </Text>
            </View>

            <View style={styles.strengthBadge}>
              <Text style={styles.strengthText}>
                {strength.label}
              </Text>
            </View>
          </View>

          <View style={styles.securityBar}>
            {[1, 2, 3, 4].map((level) => (
              <View
                key={level}
                style={[
                  styles.securitySegment,
                  level <= strength.level
                    ? styles.securityActive
                    : styles.securityInactive,
                ]}
              />
            ))}
          </View>

          <View style={styles.divider} />

          {/* Tamanho */}
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.optionTitle}>
                TAMANHO DA SENHA
              </Text>

              <Text style={styles.optionDescription}>
                Escolha entre 8 e 32 caracteres
              </Text>
            </View>

            <View style={styles.lengthControl}>
              <Pressable
                onPress={decreasePasswordLength}
                disabled={passwordLength === 8}
                style={({ pressed }) => [
                  styles.lengthButton,
                  passwordLength === 8 &&
                    styles.lengthButtonDisabled,
                  pressed &&
                    passwordLength > 8 &&
                    styles.lengthButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.lengthButtonText,
                    passwordLength === 8 &&
                      styles.lengthButtonTextDisabled,
                  ]}
                >
                  −
                </Text>
              </Pressable>

              <View style={styles.lengthValue}>
                <Text style={styles.lengthNumber}>
                  {passwordLength}
                </Text>

                <Text style={styles.lengthLabel}>
                  CAR.
                </Text>
              </View>

              <Pressable
                onPress={increasePasswordLength}
                disabled={passwordLength === 32}
                style={({ pressed }) => [
                  styles.lengthButton,
                  passwordLength === 32 &&
                    styles.lengthButtonDisabled,
                  pressed &&
                    passwordLength < 32 &&
                    styles.lengthButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.lengthButtonText,
                    passwordLength === 32 &&
                      styles.lengthButtonTextDisabled,
                  ]}
                >
                  +
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Indicador de tamanho */}
          <View style={styles.lengthRange}>
            <Text style={styles.rangeText}>
              MÍN. 8
            </Text>

            <View style={styles.rangeLine}>
              <View
                style={[
                  styles.rangeProgress,
                  {
                    width: `${progressPercentage}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.rangeText}>
              MÁX. 32
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Personalização */}
          <View style={styles.personalizeHeader}>
            <Text style={styles.optionTitle}>
              PERSONALIZAR
            </Text>

            <Text style={styles.selectedText}>
              {activeOptionsCount}{' '}
              {activeOptionsCount === 1
                ? 'ATIVO'
                : 'ATIVOS'}
            </Text>
          </View>

          <View style={styles.options}>
            <Option
              label="Letras maiúsculas"
              description="Inclui caracteres de A a Z"
              example="ABC"
              selected={uppercase}
              onPress={() =>
                handleToggleOption('uppercase')
              }
            />

            <Option
              label="Letras minúsculas"
              description="Inclui caracteres de a a z"
              example="abc"
              selected={lowercase}
              onPress={() =>
                handleToggleOption('lowercase')
              }
            />

            <Option
              label="Números"
              description="Inclui caracteres de 0 a 9"
              example="123"
              selected={numbers}
              onPress={() =>
                handleToggleOption('numbers')
              }
            />

            <Option
              label="Símbolos"
              description="Adiciona caracteres especiais"
              example="#$!"
              selected={symbols}
              onPress={() =>
                handleToggleOption('symbols')
              }
            />
          </View>

          {/* Botão gerar */}
          <Pressable
            onPress={handleGeneratePassword}
            accessibilityRole="button"
            accessibilityLabel="Gerar nova senha"
            style={({ pressed }) => [
              styles.generateButton,
              pressed && styles.generateButtonPressed,
            ]}
          >
            <View style={styles.generateSymbol}>
              <Text style={styles.generateSymbolText}>
                ↻
              </Text>
            </View>

            <Text style={styles.generateText}>
              GERAR NOVA SENHA
            </Text>
          </Pressable>

          <Text style={styles.generateHint}>
            Uma nova combinação será criada instantaneamente
          </Text>
        </View>

        {/* Privacidade */}
        <View style={styles.privacyCard}>
          <View style={styles.shield}>
            <Text style={styles.shieldCheck}>
              ✓
            </Text>
          </View>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              PRIVACIDADE EM PRIMEIRO LUGAR
            </Text>

            <Text style={styles.privacyText}>
              As senhas são geradas localmente no seu dispositivo e não são
              enviadas para servidores.
            </Text>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />

          <Text style={styles.footerBrand}>
            BAT
            <Text style={styles.footerBrandHighlight}>
              PASS
            </Text>
          </Text>

          <Text style={styles.footerText}>
            Proteção simples. Segurança inteligente.
          </Text>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type OptionProps = {
  label: string;
  description: string;
  example: string;
  selected: boolean;
  onPress: () => void;
};

function Option({
  label,
  description,
  example,
  selected,
  onPress,
}: OptionProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.optionRow,
        selected && styles.optionRowSelected,
        pressed && styles.optionPressed,
      ]}
    >
      <View style={styles.optionLeft}>
        <View
          style={[
            styles.exampleBox,
            selected && styles.exampleBoxSelected,
          ]}
        >
          <Text
            style={[
              styles.example,
              !selected && styles.exampleDisabled,
            ]}
          >
            {example}
          </Text>
        </View>

        <View style={styles.optionTexts}>
          <Text
            style={[
              styles.optionLabel,
              !selected && styles.optionLabelDisabled,
            ]}
          >
            {label}
          </Text>

          <Text style={styles.optionRowDescription}>
            {description}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.checkbox,
          !selected && styles.checkboxInactive,
        ]}
      >
        {selected && (
          <Text style={styles.check}>
            ✓
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#060606',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: '#060606',
    alignItems: 'center',
  },

  content: {
    width: '100%',
    maxWidth: 1100,
  },

  header: {
    alignItems: 'center',
    marginBottom: 34,
  },

  brandIcon: {
    width: 82,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    position: 'relative',
  },

  wingLeft: {
    position: 'absolute',
    left: 4,
    width: 36,
    height: 30,
    backgroundColor: '#F5C518',
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 6,
    transform: [{ rotate: '-12deg' }],
  },

  wingRight: {
    position: 'absolute',
    right: 4,
    width: 36,
    height: 30,
    backgroundColor: '#F5C518',
    borderTopRightRadius: 22,
    borderBottomRightRadius: 6,
    transform: [{ rotate: '12deg' }],
  },

  batCenter: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#060606',
    borderWidth: 3,
    borderColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  batLetter: {
    color: '#F5C518',
    fontSize: 19,
    fontWeight: '900',
  },

  title: {
    color: '#F5C518',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 6,
  },

  subtitle: {
    color: '#65656D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginTop: 6,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#101010',
    borderWidth: 1,
    borderColor: '#242424',
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F5C518',
    marginRight: 7,
  },

  statusText: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  intro: {
    marginBottom: 24,
  },

  introTag: {
    color: '#F5C518',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 9,
  },

  introTitle: {
    color: '#F4F4F5',
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '900',
  },

  highlight: {
    color: '#F5C518',
  },

  introDescription: {
    color: '#7C7C85',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 310,
  },

  card: {
    backgroundColor: '#101010',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#252525',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  sectionLabel: {
    color: '#F5C518',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.7,
  },

  cardSubtitle: {
    color: '#65656D',
    fontSize: 11,
    marginTop: 5,
  },

  secureBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: '#1A1A13',
    borderWidth: 1,
    borderColor: '#3A3515',
    borderRadius: 8,
  },

  secureBadgeText: {
    color: '#F5C518',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  passwordBox: {
    backgroundColor: '#070707',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#303030',
    padding: 17,
    marginBottom: 24,
  },

  passwordTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },

  passwordLabel: {
    color: '#626269',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  passwordStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#F5C518',
    marginRight: 5,
  },

  passwordStatusText: {
    color: '#777780',
    fontSize: 8,
    fontWeight: '800',
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  password: {
    flex: 1,
    color: '#F4F4F5',
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginRight: 12,
  },

  copyButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
  },

  copyButtonCopied: {
    backgroundColor: '#F5C518',
  },

  copiedIcon: {
    color: '#090909',
    fontSize: 22,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  copyIcon: {
    width: 21,
    height: 21,
    position: 'relative',
  },

  copyBack: {
    position: 'absolute',
    width: 13,
    height: 15,
    borderWidth: 2,
    borderColor: '#090909',
    borderRadius: 2,
    left: 1,
    top: 1,
  },

  copyFront: {
    position: 'absolute',
    width: 13,
    height: 15,
    borderWidth: 2,
    borderColor: '#090909',
    borderRadius: 2,
    right: 1,
    bottom: 1,
    backgroundColor: '#F5C518',
  },

  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  optionTitle: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  optionDescription: {
    color: '#606068',
    fontSize: 10,
    marginTop: 4,
  },

  strengthBadge: {
    minWidth: 62,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#201E0E',
    borderRadius: 8,
    alignItems: 'center',
  },

  strengthText: {
    color: '#F5C518',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  securityBar: {
    flexDirection: 'row',
    gap: 6,
  },

  securitySegment: {
    flex: 1,
    height: 6,
    borderRadius: 10,
  },

  securityActive: {
    backgroundColor: '#F5C518',
  },

  securityInactive: {
    backgroundColor: '#292929',
  },

  divider: {
    height: 1,
    backgroundColor: '#242424',
    marginVertical: 23,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowText: {
    flex: 1,
  },

  lengthControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: '#080808',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#303030',
    padding: 4,
  },

  lengthButton: {
    width: 36,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1B1B1B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  lengthButtonPressed: {
    backgroundColor: '#292929',
    transform: [{ scale: 0.95 }],
  },

  lengthButtonDisabled: {
    backgroundColor: '#111111',
  },

  lengthButtonText: {
    color: '#F5C518',
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 25,
  },

  lengthButtonTextDisabled: {
    color: '#3F3F43',
  },

  lengthValue: {
    minWidth: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lengthNumber: {
    color: '#F5C518',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },

  lengthLabel: {
    color: '#606068',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },

  lengthRange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  rangeText: {
    color: '#55555D',
    fontSize: 8,
    fontWeight: '800',
  },

  rangeLine: {
    flex: 1,
    height: 4,
    backgroundColor: '#292929',
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },

  rangeProgress: {
    height: '100%',
    backgroundColor: '#F5C518',
    borderRadius: 10,
  },

  personalizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedText: {
    color: '#F5C518',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  options: {
    marginTop: 10,
    gap: 5,
  },

  optionRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 13,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  optionRowSelected: {
    backgroundColor: '#12120E',
    borderColor: '#24210D',
  },

  optionPressed: {
    opacity: 0.75,
  },

  optionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  exampleBox: {
    width: 43,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#282828',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  exampleBoxSelected: {
    backgroundColor: '#1B1A0E',
    borderColor: '#343014',
  },

  example: {
    color: '#F5C518',
    fontSize: 10,
    fontWeight: '900',
  },

  exampleDisabled: {
    color: '#52525A',
  },

  optionTexts: {
    flex: 1,
  },

  optionLabel: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '700',
  },

  optionLabelDisabled: {
    color: '#707078',
  },

  optionRowDescription: {
    color: '#5D5D65',
    fontSize: 9,
    marginTop: 3,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: '#F5C518',
    borderWidth: 1,
    borderColor: '#F5C518',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  checkboxInactive: {
    backgroundColor: '#111111',
    borderColor: '#3A3A3A',
  },

  check: {
    color: '#080808',
    fontSize: 15,
    fontWeight: '900',
  },

  generateButton: {
    height: 60,
    backgroundColor: '#F5C518',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  generateButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  generateSymbol: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#090909',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  generateSymbolText: {
    color: '#F5C518',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },

  generateText: {
    color: '#080808',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  generateHint: {
    color: '#52525A',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 10,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E0E0E',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#202020',
    padding: 16,
    marginTop: 16,
  },

  shield: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#1C1A0D',
    borderWidth: 1,
    borderColor: '#393313',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  shieldCheck: {
    color: '#F5C518',
    fontSize: 18,
    fontWeight: '900',
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    color: '#BDBDC3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 5,
  },

  privacyText: {
    color: '#606068',
    fontSize: 10,
    lineHeight: 15,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 30,
  },

  footerLine: {
    width: 28,
    height: 2,
    backgroundColor: '#F5C518',
    marginBottom: 13,
  },

  footerBrand: {
    color: '#6B6B73',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },

  footerBrandHighlight: {
    color: '#F5C518',
  },

  footerText: {
    color: '#44444B',
    fontSize: 9,
    marginTop: 6,
  },
});