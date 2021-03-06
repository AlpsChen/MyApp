import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity
} from "react-native";
import FIcon from "react-native-vector-icons/Foundation";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";
import firebase from "react-native-firebase";
import Orientation from "react-native-orientation";
import { LoginManager } from "react-native-fbsdk";

const { width, height } = Dimensions.get("window");
const texts = [
  "適性模式",
  "隨機模式",
  "簡單模式",
  "中等模式",
  "困難模式",
]

export default class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      user: null,
      errorMessage: "",
      username: "",
    };
  }
  static navigationOptions = {
    header: null,
    gesturesEnabled: false,
  };

  signOut = () => {
    firebase.auth().signOut().then(() => {
      this.props.navigation.navigate("Login")
    })
    .catch((error) => this.setState({ errorMessage: error.message }))
    //firebase.database().ref("/users/" + this.state.user.uid).remove();
    LoginManager.logOut();
  }

  getUsername = () => {
    if(this.state.user){
    firebase.database().ref("/users/" + this.state.user.uid).once("value").then(
      function(snap) {
        this.setState({
          username: snap.val().username,
        });
      }.bind(this)
    );
    }
  }

  componentWillMount() {
    Orientation.lockToLandscape();
    
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
    });
    
  }

  render() {
    const { navigate } = this.props.navigation;
  const { params } = this.props.navigation.state;
    //console.warn(this.state.user.uid)
    this.getUsername();
    return (
      <View style={styles.bg}>
      <ImageBackground 
      source={require("../components/bgImage.jpg")}
      style={styles.bgImage}
      imageStyle={{resizeMode: 'cover'}}
      >
        {this.state.errorMessage?
            <Text style={{ color: "red" }}>{this.state.errorMessage}</Text> : null
          }
        <View style={styles.bg}>
        <Text style={{fontSize:30, fontWeight:"800", color:"#FFFF90"}}>{this.state.username}！來算數學吧！</Text>
          <TouchableOpacity
            onPress={() => {
              this.setState({ showModal: !this.state.showModal });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>開始練習</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigate("ModePage", {initialMode: params.mode, initialQnums: params.qnums});
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>設定模式</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.signOut()
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>登出</Text>
          </TouchableOpacity>
          
        </View>
        <Modal
          isVisible={this.state.showModal}
          supportedOrientations={["portrait", "landscape"]}
          onBackdropPress={() => this.setState({ showModal: false })}
          onSwipe={() => this.setState({ showModal: false })}
          swipeDirection={"left"}
        >
          <View style={styles.modal}>
            <View>
              <Text style={styles.modalText}>{texts[params.mode]}</Text>
              <Text style={styles.modalText}>{params.qnums}題</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                this.setState({ showModal: false });
                //var tmp = [{src:"https://firebasestorage.googleapis.com/v0/b/myapp1116.appspot.com/o/easy%2Fm7a032102c.jpg?alt=media&token=12e55536-b2ad-43f5-a035-f07897e362f5", ans:"A"}, {src:"https://firebasestorage.googleapis.com/v0/b/myapp1116.appspot.com/o/easy%2Fm7a012101d.jpg?alt=media&token=cf269b41-225a-479b-be28-df1623480d28",ans:"D"}]
                //navigate("Second", { displaynum: 1, difficulty: "easy", mode: params.mode, qnums: params.qnums });
                navigate('Third', {score: 0});
              }}
            >
              <Text style={{fontSize:20}}>
                確定
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgImage:{
    flex: 1,
    width: "100%",
    height: "100%"
  },
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#FAFAD2"
  },
  button: {
    backgroundColor: "#FFE4B5",
    padding: 16,
    margin: 10,
    borderRadius: 10,
    shadowRadius: 20,
    shadowOpacity: 0.5,
    width: 200,
  },
  buttonText: {
    fontSize: 20,
    //margin: 15,
    color: "#000000",
    //padding: 20,
    textAlign: "center"
  },
  modal: {
    flex: 1,
    marginHorizontal: "35%",
    marginVertical: "5%",
    backgroundColor: "#FFFFE0",
    borderRadius: 10,
    borderColor: "#FFE4B5",
    borderWidth: 5,
    alignItems: "center"
  },
  modalText: {
    fontSize: 20,
    marginTop: 25,
    color: "#1E90FF",
    //padding: 20,
    textAlign: "center"
  },
  modalButton: {
    fontSize: 20,
    marginTop: 50,
    color: "#00008B",
    padding: 15,
    textAlign: "center",
    backgroundColor: "#E6E6FA",
    shadowRadius: 20,
    shadowOpacity: 0.5,
    borderRadius: 10,
  }
});
