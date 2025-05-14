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
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

// Define the type for calculator operations
type OperatorType = '+' | '-' | '*' | '/';

// Section component from the template
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

// Main App component
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Calculator State
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [operator, setOperator] = useState<OperatorType | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false); // If true, next digit input starts a new number

  // Background style from the template
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1, // Ensure it takes full height
  };

  // Calculator Functions

  const plusMinus = () =>{
    if(displayValue == "Error" || displayValue == "0") return;
    const newValue = -1 * parseFloat(displayValue);
    setDisplayValue(String(newValue));
    setWaitingForOperand(false);
  }

  const percentage = () => {
    if(displayValue == "Error" || displayValue == "0") return;
    const newValue = parseFloat(displayValue)/100;
    setDisplayValue(String(newValue));
    setWaitingForOperand(false);
  }


  const inputDigit = (digit: string) => {
    if (displayValue === "Error") {
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
    const prev = parseFloat(previousValue || '0');
    const current = parseFloat(displayValue === "Error" ? '0' : displayValue);

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
    if (displayValue === "Error" && previousValue === null) {
      setPreviousValue('0');
    } else {
      const inputValue = parseFloat(displayValue === "Error" ? '0' : displayValue);
      if (previousValue === null) {
        setPreviousValue(String(inputValue));
      } else if (operator) {
        const result = performCalculation();
        if (isNaN(result)) {
          setDisplayValue("Error");
          setPreviousValue(null);
        } else {
          setDisplayValue(String(result));
          setPreviousValue(String(result));
        }
      }
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const handleEquals = () => {
    if (!operator || previousValue === null || displayValue === "Error") {
        if(displayValue === "Error") {
            return;
        }
        return;
    }
    const result = performCalculation();
    if (isNaN(result)) {
        setDisplayValue("Error");
    } else {
        setDisplayValue(String(result));
    }
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
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
      marginTop: 20, // Added some top margin since Header is removed
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
      flex: 1,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      backgroundColor: isDarkMode ? Colors.dark : '#e0e0e0',
      paddingVertical: 18,
      margin: 4,
      borderRadius: 8,
      elevation: 2,
    },
    buttonText: {
      fontSize: 26,
      color: isDarkMode ? Colors.white : Colors.black,
      fontWeight: '500' as '500',
    },
    operatorButton: {
      backgroundColor: isDarkMode ? '#ffd200' : '#0045ff',
    },
    operatorButtonText: {
      color: isDarkMode ? '#000000' : '#FFFFFF',
    },
    miscButton: {
      backgroundColor: isDarkMode ? '#505050' : '#D3D3D3',
    },
    zeroButton: {
      flex: 2,
      alignItems: 'flex-start' as 'flex-start',
      paddingLeft: 30,
    }
  };

  const renderButton = (
    text: string,
    onPress: () => void,
    type?: 'operator' | 'misc' | 'zero'
  ) => {
    let buttonStyleArr: StyleProp<ViewStyle> = [themedCalculatorStyles.button];
    let textStyleArr: StyleProp<TextStyle> = [themedCalculatorStyles.buttonText];

    if (type === 'operator') {
      buttonStyleArr.push(themedCalculatorStyles.operatorButton);
      textStyleArr.push(themedCalculatorStyles.operatorButtonText);
    } else if (type === 'misc') {
      buttonStyleArr.push(themedCalculatorStyles.miscButton);
    } else if (type === 'zero') {
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
        {/* <Header />  // This line is now removed/commented out */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingBottom: 190, // Added some padding at the bottom for scroll content
          }}>
          <Section title="The Calculator"></Section>

          <View style={themedCalculatorStyles.displayContainer}>
            <Text style={themedCalculatorStyles.displayText}>{displayValue}</Text>
          </View>

          <View style={themedCalculatorStyles.buttonRow}>
            {renderButton('AC', clearDisplay, 'misc')}
            {renderButton('+/-', plusMinus, 'misc')}
            {renderButton('%', percentage, 'misc')}
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
