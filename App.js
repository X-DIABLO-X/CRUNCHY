import { View, Text, Animated, StyleSheet, TextInput, TouchableOpacity, Image, FlatList } from "react-native";
import { useState, useCallback } from "react";
import currencies from './data.json';
import info from './info.json';
export default function App() {
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchQueryFrom, setSearchQueryFrom] = useState('');
  const [searchQueryTo, setSearchQueryTo] = useState('');
  const [rotateValue] = useState(new Animated.Value(0));

  const handlePress = () => {
    Animated.timing(rotateValue, {
      toValue: 360,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      rotateValue.setValue(0);
    });
  };

  const filteredCurrenciesFrom = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQueryFrom.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQueryFrom.toLowerCase())
  );

  const filteredCurrenciesTo = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQueryTo.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQueryTo.toLowerCase())
  );

  const convertCurrency = () => {
    if (!amount || !fromCurrency || !toCurrency) return;
    const conversionRates = info.conversion_rates;
    console.log(conversionRates);
    const fromRate = conversionRates[fromCurrency];
    const toRate = conversionRates[toCurrency];
    const converted = (parseFloat(amount) * toRate / fromRate).toFixed(2);
    setResult(converted);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(result);
    setResult(amount);
    setSearchQueryFrom('');
    setSearchQueryTo('');
    Animated.timing(rotateValue, {
      toValue: 180,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateValue.setValue(0);
    });
  };

  const CurrencyItem = useCallback(({ currency, onSelect }) => (
    <TouchableOpacity 
      style={styles.currencyItem} 
      onPress={() => onSelect(currency.code)}
    >
      <Image
        source={{ uri: currency.flag }}
        style={styles.flagImage}
      />
      <Text style={styles.currencyItemText}>
        {`${currency.code} - ${currency.name}`}
      </Text>
    </TouchableOpacity>
  ), []);

  const renderDropdown = (
    searchQuery,
    setSearchQuery,
    filteredCurrencies,
    onSelect,
    placeholder
  ) => (
    <View style={styles.dropdownContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={`Search ${placeholder}`}
      ed
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <CurrencyItem
            currency={item}
            onSelect={(code) => {
              onSelect(code);
              setSearchQuery('');
            }}
          />
        )}
        style={styles.dropdownList}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Currency Converter</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>From:</Text>
          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => {
              setShowFromDropdown(!showFromDropdown);
              setShowToDropdown(false);
            }}
          >
            {fromCurrency ? (
              <View style={styles.selectedCurrency}>
                <Image
                  source={{ uri: currencies.find(c => c.code === fromCurrency)?.flag }}
                  style={styles.selectedFlag}
                />
                <Text style={styles.selectedCurrencyText}>
                  {`${fromCurrency} - ${currencies.find(c => c.code === fromCurrency)?.name}`}
                </Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select currency</Text>
            )}
          </TouchableOpacity>
          {showFromDropdown && renderDropdown(
            searchQueryFrom,
            setSearchQueryFrom,
            filteredCurrenciesFrom,
            (code) => {
              setFromCurrency(code);
              setShowFromDropdown(false);
            },
            "currency"
          )}
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
          <Text style={styles.swapButtonText}><Animated.Image
          source={require('./assets/alter.png')}
          style={{
            height: 20,
            width: 20,
            marginRight: 1,
            transform: [
              {
                rotate: rotateValue.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
  Swap</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>To:</Text>
          <TouchableOpacity
            style={styles.currencySelector}
            onPress={() => {
              setShowToDropdown(!showToDropdown);
              setShowFromDropdown(false);
            }}
          >
            {toCurrency ? (
              <View style={styles.selectedCurrency}>
                <Image
                  source={{ uri: currencies.find(c => c.code === toCurrency)?.flag }}
                  style={styles.selectedFlag}
                />
                <Text style={styles.selectedCurrencyText}>
                  {`${toCurrency} - ${currencies.find(c => c.code === toCurrency)?.name}`}
                </Text>
              </View>
            ) : (
              <Text style={styles.placeholderText}>Select currency</Text>
            )}
          </TouchableOpacity>
          {showToDropdown && renderDropdown(
            searchQueryTo,
            setSearchQueryTo,
            filteredCurrenciesTo,
            (code) => {
              setToCurrency(code);
              setShowToDropdown(false);
            },
            "currency"
          )}
          <TextInput
            style={[styles.input, styles.resultInput]}
            value={result}
            editable={false}
            placeholder="Result"
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.convertButton,
            (!fromCurrency || !toCurrency || !amount) && styles.convertButtonDisabled
          ]} 
          onPress={convertCurrency}
          disabled={!fromCurrency || !toCurrency || !amount}
        >
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  currencySelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  selectedCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedFlag: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  selectedCurrencyText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1000,
    maxHeight: 300,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    fontSize: 16,
  },
  dropdownList: {
    maxHeight: 250,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  flagImage: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  currencyItemText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  resultInput: {
    backgroundColor: '#f9f9f9',
  },
  swapButton: {
    alignSelf: 'center',
    padding: 10,
    marginVertical: 10,
  },
  swapButtonText: {
    fontSize: 20,
  },
  convertButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  convertButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});