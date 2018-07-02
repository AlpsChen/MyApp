import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  State,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  TouchableHighlight,
} from "react-native";
import firebase from "react-native-firebase";
import FastImage from "react-native-fast-image";
import ChoiceButton from "../components/choicebutton";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/Foundation";
import EIcon from "react-native-vector-icons/Entypo";
import Orientation from "react-native-orientation";
import SketchDraw from "react-native-sketch-draw";
import Drawer from "react-native-drawer";
//import images from "../../questions";

const iosConfig = {
  clientId:
    "163605876535-b8nca0rgug75bphrobpmrpjd02onr2np.apps.googleusercontent.com",
  appId: "1:163605876535:ios:e9b4e1bdb99bad8f",
  apiKey: "AIzaSyAC4lAbF8f-ffsL44NSfQFvruI6BxjCg8k",
  databaseURL: "https://myapp1116.firebaseio.com/",
  storageBucket: "myapp1116.appspot.com"
  //messaging:
};
//firebase.initializeApp(iosConfig);

(easy = 18), (medium = 5), (hard = 14);
var choseneasy = [easy],
    chosenmedium = [medium],
    chosenhard = [hard];
const bgcolor = "#FFE4B5";
const sdc = SketchDraw.constants;
const {height, width} = Dimensions.get("screen");
var marked = [];

const ImageHeader = props => {
  return(
    <View 
    //style={{height: 10*vh, justifyContent: 'flex-end', padding: 5, backgroundColor: 'transparent'}}
    >
      <Image
        style={{width:"100%", height: 50}}
        source={require('../components/bgImage.jpg')}
        resizeMode="cover"
      />
    </View>
  );
}

export default class QuestionPage extends Component {
  constructor(props) {
    super(props);
    this.num = 0;
    this.score = 0;
    this.difficulty = "easy";
    this.image = "";
    //this.marked = ["a"];
    this.state = {
      data: "",
      shownext: false,
      renew: false,
      imageHeight: 0,
      correct: false,
      penColor: "#87CEFA",
      tool: sdc.toolType.pen.id,
      showModal: false,
      mark: false,
    };
    Orientation.lockToLandscape();
    choseneasy.fill(false);
    chosenmedium.fill(false);
    chosenhard.fill(false);
    this.next();
  }

  componentWillMount() {
    Orientation.lockToLandscape();
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    var mark = false;
    return {
      title: "題目：" + params.displaynum + "/" + params.qnums,
      headerStyle: {
        backgroundColor: "#FAFAD2"
      },
      //header: <ImageHeader/>,
      headerLeft: (

        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("你確定要離開嗎", "記錄將不會被儲存", [
                {
                  text: "確定",
                  onPress: () => {
                    navigation.goBack();
                  }
                },
                { text: "不要啊", onPress: () => {}, style: "cancel" }
              ]);
            }}
          >
            <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
              {"   "}
              離開{"    "}
            </Text>
          </TouchableOpacity>
          {params.mark?
          
          <MCIcon
            name={"bookmark"}
            onPress={() => {
              params.onClickMark(params.mark)
            }}
            color={"#000"}
            size={24}
            style={{marginTop:3}}
          >
          {/* <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
              標記
            </Text> */}
          </MCIcon>
          
          :
          <MCIcon
            name={"bookmark-outline"}
            onPress={() => {
              params.onClickMark(params.mark)
            }}
            color={"#000"}
            size={24}
            style={{marginTop:3}}
          >
            {/* <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
              標記
            </Text> */}
          </MCIcon>}
        </View>
      ),
      headerRight: (
        <View style={styles.topright}>
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 18 }}>
            難度：
          </Text>
          {params.icons}
        </View>
      )
    };
  };

  onClickMark = (now) => {
    if(now){ //unmark question
      this.props.navigation.setParams({mark: false})
      marked.pop()
    }
    else{ //mark question
      this.props.navigation.setParams({mark: true})
      marked.push({src: this.state.src, ans: this.state.ans})
    }
  }

  displaystars() {
    switch (this.difficulty) {
      case "easy":
        var stars = 1;
        break;
      case "medium":
        var stars = 2;
        break;
      case "hard":
        var stars = 3;
        break;
    }
    var IconArray = [5];
    for (let i = 0; i < stars; i++) {
      IconArray[i] = <FIcon key={i} name={"star"} size={26} />;
    }
    for (let i = stars; i < 5; i++) {
      IconArray[i] = <Text key={i}> </Text>;
    }
    return IconArray;
  }

  setState_difficulty(nxt) {
    this.difficulty = nxt;
  }

  //determine the difficulty of the next question (according to the mode)
  determine_next() {
    let { params } = this.props.navigation.state;
    switch (params.mode) {

      //adapting mode
      case 0:
        if (this.state.correct) {
          switch (this.difficulty) {
            case "easy":
              this.setState_difficulty("medium");
              break;
            case "medium":
              this.setState_difficulty("hard");
              break;
            case "hard":
              break;
          }
        } else {
          switch (this.difficulty) {
            case "easy":
              //alert('簡單題欸！');
              break;
            case "medium":
              this.setState_difficulty("easy");
              break;
            case "hard":
              this.setState_difficulty("medium");
              break;
          }
        }
        break;
      
      //random mode
      case 1:
        var i = Math.floor(Math.random() * 3);
        if (i == 0) this.setState_difficulty("easy");
        else if (i == 1) this.setState_difficulty("medium");
        else this.setState_difficulty("hard");
        break;

      //easy mode
      case 2:
        this.setState_difficulty("easy");
        break;

      //medium mode
      case 3:
        this.setState_difficulty("medium");
        break;

      //hard mode
      case 4:
        this.setState_difficulty("hard");
        break;
    }
    //console.warn(this.state.difficulty);
  }

  generateRandom(currentDifficulty, currentArray) {
    do {
      var i = Math.floor(Math.random() * currentDifficulty);
    } while (currentArray[i]);
    currentArray[i] = true;
    return i;
  }

  next() {
    if (this.num < this.props.navigation.state.params.qnums) {
      this.num++;
      //console.warn(this.state.correct);
      this.determine_next();

      let i;
      switch (this.difficulty) {
        case "easy":
          i = this.generateRandom(easy, choseneasy);
          break;
        case "medium":
          i = this.generateRandom(medium, chosenmedium);
          break;
        case "hard":
          i = this.generateRandom(hard, chosenhard);
          break;
      }

      //download json data from Firebase
      firebase
        .database()
        .ref("/questionBank/" +"easy" + "/" + "1")
        .once("value")
        .then(
          function(snap) {
            this.setState({
              data: snap.val(),
              shownext: false,
              renew: false,
              correct: false,
              onClickMark: this.onClickMark.bind(this),
            });
          }.bind(this)
        );
      var starArray = this.displaystars();
      this.props.navigation.setParams({
        displaynum: this.num,
        difficult: this.difficulty,
        icons: starArray,
        onClickMark: this.onClickMark.bind(this),
        mark: false,
      });
    } else {
      //go to scoring page
      var { navigate } = this.props.navigation;
      navigate("Third", { score: this.score, marked: marked });
    }
  }

  showoptions() {
    var options = [];
    for (let i = 0; i < 4; i++) {
      var option = String.fromCharCode("A".charCodeAt() + i);
      let correctoption = option.localeCompare(this.state.data.answer);
      options.push(
        <View key={option}>
          {this.state.renew ? null : (
            <ChoiceButton
              text={option}
              close={this.state.shownext ? true : false}
              onColor={correctoption ? "red" : "green"}
              shouldshake={correctoption ? true : false}
              _onPress={() => {
                this.setState({ shownext: true });
                //console.warn(this.state.shownext);
                if (!correctoption) {
                  //the option is correct when correctoption = 0
                  this.setState({ correct: true });
                  this.score += 1 / this.props.navigation.state.params.qnums;
                  //console.warn(this.state.correct);
                }
              }}
            />
          )}
        </View>
      );
    }
    return options;
  }

  // renderIf(condition, content){
  //   return condition? content:null;
  // }

  // _onLayout() {
  //   if (this.state.src) {
  //     Image.getSize(this.state.src, (w, h) => {
  //       this.setState({
  //         imageHeight: Dimensions.get("window").width * h / w
  //       });
  //     });
  //   }
  // }

  drawerContent = () => {
  return(
  <View style={{
    flex: 1,
    flexDirection: "row",
    
  }}>
  <View style={{ flex: 0.5, flexDirection: "column", backgroundColor: "#FFE4B5", alignItems: "center" }}>
  <EIcon
      name={"pencil"}
      size={35}
      color={this.state.tool === sdc.toolType.pen.id? "#808080":"#000"}
      onPress={() => {
        this.setState({
          tool: sdc.toolType.pen.id
        })
      }}
      style={{marginTop: 5}}
    />
    
    {/* <TouchableHighlight
      underlayColor={"#CCC"}
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: 20,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: "#DDD"
      }}
      onPress={() => {
        this.refs.sketchRef.saveSketch();
      }}
    >
      <Text style={{ color: "#888", fontWeight: "600" }}>SAVE</Text>
    </TouchableHighlight> */}
    <EIcon
      name={"eraser"}
      size={35}
      color={this.state.tool == sdc.toolType.eraser.id? "#808080":"#000"}
      onPress={() => {
        this.setState({
          tool: sdc.toolType.eraser.id,
        })
      }}
    />
    <MCIcon
      name={"delete"}
      size={35}
      color={"#000"}
      onPress={() => {
        this.refs.sketchRef.clearSketch();
      }}
    />
    
  {/* </View> */}
  {/* <View style={{ flex: 0.5, flexDirection: "column", backgroundColor: "#FFE4B5" }}> */}
  {this.renderColorButton("#008000")}
  {this.renderColorButton("#FF6347")}
  {this.renderColorButton("#87CEFA")}
  </View>
  <SketchDraw
    style={[{ flex: 5, height:300}, styles.drawer]}
    ref="sketchRef"
    selectedTool={this.state.tool}
    toolColor={this.state.penColor}
    //onSaveSketch={this.onSketchSave.bind(this)}
    //localSourceImagePath={this.props.localSourceImagePath}
  />
  </View>
)
}


  renderColorButton = color => {
    const active = color === this.state.penColor;

    return (
      <TouchableOpacity
        onPress={() => this.setState({penColor: color})}
        style={[
          styles.colorButton,
          {
            backgroundColor: active ? "#FABBA9" : color,
            borderColor: color
          }
        ]}
      />
    );
  };

  render() {
    //Image.prefetch({uri:this.state.src});
    return (
      
      <View style={styles.bg}>
        
        {this.state.renew? null:(<Drawer
          type="overlay"
          open={this.state.showModal}
          openDrawerOffset={0.2}
          //closedDrawerOffset={-3}
          styles={styles.drawer}
          //tweenHandler={Drawer.tweenPresets.parallax}
          side={"bottom"}
          ref={(ref) => this._drawer = ref}
          onCloseStart={()=>{this.setState({showModal:false})}}
          content={this.drawerContent()}
        >
          <View
          style={{ flex: 2, justifyContent: "center" }}
        >
        
          {/* display question */}
          <ScrollView>
            <Text style={{fontSize:24, marginHorizontal: 20, marginTop:5}}>{this.state.data.content}{"\n"}</Text>
            <Text style={{fontSize:24, marginHorizontal: 20}}>(A) {"  "}{this.state.data.A}</Text>
            <Text style={{fontSize:24, marginHorizontal: 20}}>(B) {"  "}{this.state.data.B}</Text>
            <Text style={{fontSize:24, marginHorizontal: 20}}>(C) {"  "}{this.state.data.C}</Text>
            <Text style={{fontSize:24, marginHorizontal: 20}}>(D) {"  "}{this.state.data.D}</Text>
          </ScrollView>
        </View>
        
        <View style={styles.buttons}>
          {this.showoptions()}
          <View style={styles.nextbutton}>
            <MCIcon
              name={"arrow-right-bold-box"}
              size={85}
              color={this.state.shownext ? "#FFFFFF" : bgcolor}
              onPress={() => {
                //console.warn(this.state.shownext);
                if (this.state.shownext) {
                  this.next();
                  this.setState({
                    renew: true
                  });
                }
              }}
            />
            {/* <Text>{this.state.ans}</Text> */}
          </View>
          <TouchableOpacity
              underlayColor={"#CCC"}
              style={{ alignItems: "center", paddingVertical: 10}}
              onPress={() => {
                this.setState({
                  showModal: true,
                })
              }}
            >
              <Text style={{ color: "#888", fontWeight: "600", fontSize: 20 }}>計算紙</Text>
            </TouchableOpacity>
        </View>
        </Drawer>)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    //justifyContent: 'space-around',
    backgroundColor: "#FFFFFF"
  },
  image: {
    width: "100%"
    //height: height,
    //resizeMode: "contain"
  },
  buttons: {
    flex: 0.7,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: bgcolor
  },
  nextbutton: {
    //padding: 10,
    //borderRadius: 28
  },
  topright: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  drawer: {
    backgroundColor: '#11111155',
    //borderRadius: 5,
    borderColor: bgcolor,
    //shadowRadius: 3
  },
  colorButton: {
    borderRadius: 50,
    borderWidth: 8,
    width: 25,
    height: 25,
    marginVertical: 5,
  },
});
