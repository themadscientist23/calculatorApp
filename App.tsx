/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  type StyleProp, // Import StyleProp
  type ViewStyle,  // Import ViewStyle
  type TextStyle,  // Import TextStyle
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';

type OperatorType = '+' | '-' | '*' | '/';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [displayValue, setDisplayValue] = useState<string>('0');
  const [operator, setOperator] = useState<OperatorType | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const inputDigit = (digit: string) => {
    if (displayValue === "Error") { // If last operation was an error, start fresh
        setDisplayValue(digit);
        setWaitingForOperand(false);
        return;
    }
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (displayValue === "Error") {
        setDisplayValue('0.');
        setWaitingForOperand(false);
        return;
    }
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearDisplay = () => {
    setDisplayValue('0');
    setOperator(null);
    setPreviousValue(null);
    setWaitingForOperand(false);
  };

  const performCalculation = (): number => {
    // Ensure previousValue and displayValue are valid numbers before parsing
    const prev = parseFloat(previousValue || '0'); // Default to 0 if null
    const current = parseFloat(displayValue === "Error" ? '0' : displayValue); // Default to 0 if "Error"

    if (operator === '+') return prev + current;
    if (operator === '-') return prev - current;
    if (operator === '*') return prev * current;
    if (operator === '/') {
        if (current === 0) {
            console.error("Division by zero");
            return NaN;
        }
        return prev / current;
    }
    return current;
  };

  const handleOperator = (nextOperator: OperatorType) => {
    if (displayValue === "Error" && previousValue === null) { // If error and no pending operation, reset
        clearDisplay();
        // Optionally, allow setting a new previousValue if an operator is pressed after an error
        // setPreviousValue('0'); // Or some other default
        // But for now, let's assume operator after error means start fresh or continue if there was a previous value
    }

    const inputValue = parseFloat(displayValue === "Error" ? '0' : displayValue);

    if (previousValue === null || displayValue === "Error") { // If no previous value or current is error, set current as previous
      setPreviousValue(String(inputValue));
    } else if (operator) { // If there's a previous value and an operator, perform calculation
      const result = performCalculation();
      if (isNaN(result)) {
        setDisplayValue("Error");
        setPreviousValue(null); // Reset previous value on error
      } else {
        setDisplayValue(String(result));
        setPreviousValue(String(result));
      }
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (!operator || previousValue === null || displayValue === "Error") return;
    const result = performCalculation();
    if (isNaN(result)) {
        setDisplayValue("Error");
    } else {
        setDisplayValue(String(result));
    }
    setPreviousValue(null); // Reset previousValue for the next independent calculation
    setOperator(null);
    setWaitingForOperand(true); // Next digit input should start a new number
  };

  const themedCalculatorStyles = {
    displayContainer: {
      backgroundColor: isDarkMode ? '#1E1E1E' : '#F3F3F3',
      paddingHorizontal: 20,
      paddingVertical: 30,
      alignItems: 'flex-end' as 'flex-end',
      marginBottom: 10,
      borderRadius: 5,
      marginHorizontal: 10,
      marginTop: 10,
    },
    displayText: {
      fontSize: 50,
      color: isDarkMode ? Colors.white : Colors.black,
      fontWeight: '300' as '300',
    },
    buttonRow: {
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      marginHorizontal: 10,
      marginBottom: 10,
    },
    button: {
      flex: 1, // Each button in a row tries to take equal width
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      backgroundColor: isDarkMode ? Colors.dark : '#e0e0e0',
      paddingVertical: 18,
      margin: 4, // Small gap between buttons
      borderRadius: 8,
      elevation: 2, // Android shadow
    },
    buttonText: {
      fontSize: 26,
      color: isDarkMode ? Colors.white : Colors.black,
      fontWeight: '500' as '500',
    },
    operatorButton: {
      backgroundColor: isDarkMode ? '#FF9500' : '#FFA500',
    },
    operatorButtonText: {
      color: '#FFFFFF',
    },
    miscButton: {
      backgroundColor: isDarkMode ? '#505050' : '#D3D3D3',
    },
    zeroButton: {
      flex: 2, // Make the '0' button roughly twice as wide as other buttons (e.g. 2 buttons + its margin)
              // The total flex in its row is 2 (for 0) + 1 (for .) + 1 (for =), so 0 takes 2/4 = 50% of space for flex items.
      alignItems: 'flex-start' as 'flex-start', // Align text to the left for wider button
      paddingLeft: 30, // Add padding to position the '0' text nicely
    }
  };

  const renderButton = (
    text: string,
    onPress: () => void,
    type?: 'operator' | 'misc' | 'zero'
  ) => {
    // Explicitly type the style arrays
    let buttonStyleArr: StyleProp<ViewStyle> = [themedCalculatorStyles.button];
    let textStyleArr: StyleProp<TextStyle> = [themedCalculatorStyles.buttonText];

    if (type === 'operator') {
      buttonStyleArr.push(themedCalculatorStyles.operatorButton);
      textStyleArr.push(themedCalculatorStyles.operatorButtonText);
    } else if (type === 'misc') {
      buttonStyleArr.push(themedCalculatorStyles.miscButton);
    } else if (type === 'zero') {
      // For the zero button, we want its specific styles to override some base button styles
      // like flex and alignItems, so we ensure it's applied correctly.
      // The base `themedCalculatorStyles.button` provides common properties like padding, margin, borderRadius.
      buttonStyleArr.push(themedCalculatorStyles.zeroButton);
    }

    return (
      <TouchableOpacity style={buttonStyleArr} onPress={onPress}>
        <Text style={textStyleArr}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Basic Calculator">
            Perform simple calculations below.
          </Section>

          <View style={themedCalculatorStyles.displayContainer}>
            <Text style={themedCalculatorStyles.displayText}>{displayValue}</Text>
          </View>

          <View style={themedCalculatorStyles.buttonRow}>
            {renderButton('AC', clearDisplay, 'misc')}
            {renderButton('+/-', () => console.log('+/- pressed'), 'misc')}
            {renderButton('%', () => console.log('% pressed'), 'misc')}
            {renderButton('/', () => handleOperator('/'), 'operator')}
          </View>
          <View style={themedCalculatorStyles.buttonRow}>
            {renderButton('7', () => inputDigit('7'))}
            {renderButton('8', () => inputDigit('8'))}
            {renderButton('9', () => inputDigit('9'))}
            {renderButton('*', () => handleOperator('*'), 'operator')}
          </View>
          <View style={themedCalculatorStyles.buttonRow}>
            {renderButton('4', () => inputDigit('4'))}
            {renderButton('5', () => inputDigit('5'))}
            {renderButton('6', () => inputDigit('6'))}
            {renderButton('-', () => handleOperator('-'), 'operator')}
          </View>
          <View style={themedCalculatorStyles.buttonRow}>
            {renderButton('1', () => inputDigit('1'))}
            {renderButton('2', () => inputDigit('2'))}
            {renderButton('3', () => inputDigit('3'))}
            {renderButton('+', () => handleOperator('+'), 'operator')}
          </View>
          <View style={themedCalculatorStyles.buttonRow}>
            {renderButton('0', () => inputDigit('0'), 'zero')}
            {renderButton('.', inputDecimal)}
            {renderButton('=', handleEquals, 'operator')}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
