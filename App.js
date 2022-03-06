import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Fontisto } from "@expo/vector-icons";

const icons = {
  Rain: "rains",
  Drizzle: "rain",
  Cloudy: "cloudy",
  Sunny: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Thunderstorm: "lightning",
};

import MOCK_WEATHER from "./mock_weather_data.json";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "XX";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync();

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );

    setCity(location[0].city);

    // const response = await fetch(
    //   `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alert&appid=${API_KEY}`
    // );
    // const json = await response.json();
    // console.log(json);

    const json = MOCK_WEATHER;
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>
              <Text style={styles.description}> {day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },

  weather: {},
  day: {
    width: SCREEN_WIDTH,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    color: "white",
  },
  description: {
    marginTop: -10,
    fontSize: 40,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  },
});
