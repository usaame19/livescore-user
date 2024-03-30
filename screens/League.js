import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API } from "../lib/config";
import HomeScreen from "./Home";

const Tab = createMaterialTopTabNavigator();

const LeagueScreen = () => {
  const navigation = useNavigation();
  const [league, setLeague] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeagueData = async () => {
      try {
        const response = await axios.get(`${API}/leagues/get-leagues`);
        setLeague(response.data.leagues[response.data.leagues.length - 1]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching league data:", error);
      }
    };

    fetchLeagueData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1e90ff" />
        </View>
      ) : league ? (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>{league.name}</Text>
            <Text style={styles.subHeader}>{league.year}</Text>
          </View>

          <Tab.Navigator
            screenOptions={{
              labelStyle: { fontSize: 14, fontWeight: "bold" },
              style: { backgroundColor: "#ffffff" },
            }}
          >
            <Tab.Screen name="LeagueTable">
              {() => <LeagueTableScreen league={league} setLeague={setLeague} />}
            </Tab.Screen>
            <Tab.Screen name="LeagueMatches">{() => <HomeScreen />}</Tab.Screen>
          </Tab.Navigator>
        </>
      ) : (
        <Text style={styles.noData}>No league data available</Text>
      )}
    </SafeAreaView>
  );
};

const LeagueTableScreen = ({ league, setLeague }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${API}/leagues/get-leagues`);
      setLeague(response.data.leagues[response.data.leagues.length - 1]);
    } catch (error) {
      console.error("Error refreshing league data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Extract league data from props
  const leagueTeams = league.teams;

  // Sort teams by points
  const sortedTeams = leagueTeams.sort((a, b) => b.points - a.points);

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {sortedTeams.map((team, index) => (
        <View key={team.id} style={styles.teamItem}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamPoints}>{team.points}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // A very light grey background
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333", // Dark grey for contrast on white background
  },
  subHeader: {
    fontSize: 18,
    color: "#555555", // A slightly lighter grey for subtext
  },
  noData: {
    color: "#333333",
    textAlign: "center",
  },
  teamItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  teamName: {
    fontSize: 16,
  },
  teamPoints: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LeagueScreen;
