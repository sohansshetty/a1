const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/getWeather', async (req, res) => {
    try {
        const { cities } = req.body;
        const weatherData = {};

        for (const city of cities) {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`);
            const temperature = response.data.main.temp + '°C';
            weatherData[city] = temperature;
        }

        res.json({ weather: weatherData });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
