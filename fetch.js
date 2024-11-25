import axios from 'axios';
import fs from 'fs';

const updateExchangeRates = async () => {
  try {
    const response = await axios.get('https://v6.exchangerate-api.com/v6/6cebe4aa18575058346e6993/latest/USD');
    const data = response.data;
    const rates = data.conversion_rates;
    console.log(data.conversion_rates.INR);
    const infoJson = JSON.parse(fs.readFileSync('info.json', 'utf8'));
    infoJson.conversion_rates = rates;
    fs.writeFileSync('info.json', JSON.stringify(infoJson, null, 2));

    console.log('Exchange rates updated successfully!');
  } catch (error) {
    console.error('Error updating exchange rates:', error);
  }
};
updateExchangeRates()

setInterval(updateExchangeRates, 24 * 60 * 60 * 1000);