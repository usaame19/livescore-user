import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { API } from "../lib/config";

const MatchCard = ({ team1, team2, score, time, status, date }) => {
  let statusText = "Unknown";
  let statusColor = "white";

  if (status) {
    switch (status) {
      case "COMPLETED":
        statusText = "Completed";
        break;
      case "LIVE":
        statusText = "🔴 Live";
        statusColor = "#ff6347";
        break;
      case "PAUSE":
        statusText = "Half Time";
        break;
      case "POSTPONED":
        statusText = "Postponed";
        break;
      case "SCHEDULED":
        statusText = formatDate(date);
        break;
      default:
        console.log("Unknown status:", status);
        console.log("statusText:", statusText);
    }
  }

  return (
    <View style={[styles.matchCard, { backgroundColor: statusColor }]}>
      <View style={styles.teamContainer}>
        <Text style={styles.logoHome}>{team1.charAt(0)}</Text>
        <Text style={styles.teamName}>{team1}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>
          {status === "SCHEDULED" ? formatTime(date) : score}
        </Text>
        <Text style={styles.time}>{statusText}</Text>
      </View>
      <View style={styles.teamContainer}>
        <Text style={styles.logoAway}>{team2.charAt(0)}</Text>
        <Text style={styles.teamName}>{team2}</Text>
      </View>
    </View>
  );
};
const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "2-digit",
    month: "short",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
};
const formatTime = (inputDate) => {
  const date = new Date(inputDate);
  const options = {
    hour: "numeric",
    minute: "numeric",
  };
  return new Intl.DateTimeFormat("en-GB", options).format(date);
};
const HomeScreen = () => {
  const [matches, setMatches] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(
        `${API}/matches/get-matches`
      );
      const sortedMatches = sortMatches(response.data);
      
      setMatches(sortedMatches);
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  // Function to sort matches based on status
  const sortMatches = (matches) => {
    return matches.sort((a, b) => {
      const statusOrder = {
        COMPLETED: 0,
        LIVE: 1,
        PAUSE: 2,
        SCHEDULED: 3,
      };
      return statusOrder[a.status] - statusOrder[b.status];
    });
  };

  // Separate live matches from other matches
  const liveMatches = matches.filter((match) => match.status === "LIVE");
  const otherMatches = matches.filter((match) => match.status !== "LIVE");

  return (
    <View style={styles.container}>
      {loading ? (
        // Show loading indicator when fetching data
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {liveMatches.length > 0 && (
            <>
              <Text style={styles.header}>Live Matches</Text>
              <ScrollView style={styles.scrollView}>
                {liveMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    team1={match.home.name}
                    team2={match.away.name}
                    score={`${match.scoreTeamOne}:${match.scoreTeamTwo}`}
                    status={match.status}
                    date={match.dateTime}
                  />
                ))}
              </ScrollView>
            </>
          )}
          <Text style={styles.header}>Matches</Text>
          <ScrollView style={styles.scrollView}>
            {otherMatches.map((match) => (
              <MatchCard
                key={match.id}
                team1={match.home.name}
                team2={match.away.name}
                score={`${match.scoreTeamOne}:${match.scoreTeamTwo}`}
                status={match.status}
                date={match.dateTime}
              />
            ))}
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 50,
  },
  scrollView: {
    flex: 0,
  },
  matchCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  teamContainer: {
    alignItems: "center",
  },
  logoHome: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#ffffff",
    backgroundColor: "#16247d",
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: "center",
    lineHeight: 50,
    overflow: "hidden",
    marginBottom: 5,
  },
  logoAway: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#ffffff",
    backgroundColor: "blue",
    width: 50,
    height: 50,
    borderRadius: 25,
    textAlign: "center",
    lineHeight: 50,
    overflow: "hidden",
    marginBottom: 5,
  },
  teamName: {
    fontSize: 16,
  },
  scoreContainer: {
    alignItems: "center",
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  time: {
    fontSize: 16,
    color: "#333333",
  },
});

export default HomeScreen;
