import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { StackNavigator } from "react-navigation";
import WelcomePage from "./screens/welcome";
import QuestionPage from "./screens/question";
import ScoringPage from "./screens/scoring";
import Loading from "./screens/login/loading";
import SignUp from "./screens/login/signup";
import Login from "./screens/login/login";
import ModePage from "./screens/mode";
import ReviewPage from "./screens/review";
import HeaderBackButton from "react-navigation/src/views/Header/HeaderBackButton";

const Navigation = StackNavigator(
  {
    First: { screen: WelcomePage },
    Second: { screen: QuestionPage },
    Third: { screen: ScoringPage },
    Loading,
    SignUp,
    Login,
    ModePage,
    ReviewPage,
  },
  {
    initialRouteName: "Loading"
  }
);

console.disableYellowBox = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export default Navigation;
