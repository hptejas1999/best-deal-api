import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const API_URL = 'https://best-deal-api.onrender.com/search?product='; // Replace with your actual API URL

export default function App() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL + encodeURIComponent(query));
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Best Deal Finder</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={fetchPrices} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.store}>{item.store}</Text>
            <Text style={styles.price}>{item.price !== 'Not found' ? `₹${item.price}` : 'Not found'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 5,
  },
  store: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    color: 'green',
  },
});
