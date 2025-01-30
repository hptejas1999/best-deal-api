import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const API_URL = 'https://best-deal-api-india.onrender.com/search'; // Replace with your actual API URL

const App = () => {
  const [product, setProduct] = useState('');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    if (!product.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?product=${encodeURIComponent(product)}`);
      const data = await response.json();
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Best Deal Finder</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={product}
        onChangeText={setProduct}
      />
      <Button title="Search" onPress={fetchPrices} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <FlatList
        data={prices}
        keyExtractor={(item) => item.store}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.store}>{item.store}</Text>
            <Text style={styles.price}>{item.price !== 'Not found' ? `₹${item.price}` : 'Not Found'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  store: { fontSize: 18, fontWeight: 'bold' },
  price: { fontSize: 16, color: 'green' },
});

export default App;
