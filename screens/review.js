import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native'
import Swiper from 'react-native-swiper'
const { width } = Dimensions.get('window')

export default class ReviewPage extends Component {
    constructor(props){
        super(props);
        this.imageHeight = 0;
        this.state = {
        
            src: "",
        }
    }
    
    static navigationOptions = {
        header: null,
        gesturesEnabled: false,
      };
    renderPagination = (index, total, context) => {
        return (
          <View style={styles.paginationStyle}>
            <Text style={{ color: 'grey' }}>
              <Text style={styles.paginationText}>{index + 1}</Text>/{total}
            </Text>
          </View>
        )
      }
      image = (i) => {
        let {params} = this.props.navigation.state;
          return(
            <View style={styles.slide} onLayout={this._onLayout(i)}>
              <ScrollView>
                <Image style={[styles.image, {height:this.imageHeight}]} source={{uri: params.marked[i].src}} />
              </ScrollView>
          </View>
          )
      }
  renderImages = () => {
    let {params} = this.props.navigation.state;
    let qnums = params.marked.length;
    let arr = [];
      for(let i=0; i<qnums; i++){
        
        arr.push(this.image(i)) 
      }
    
    return (arr);
  }

  _onLayout = (i) => {
      let {params} = this.props.navigation.state;
      Image.getSize(params.marked[i].src, (w, h) => {
        
          this.imageHeight =  Dimensions.get("window").width * h / w
      });
  }

  render () {
    //let qnums = this.props.navigation.state.params.marked.length;
    return (
        <View style={styles.slide}>
        {/* {qnums?  */}
        <Swiper
          style={styles.wrapper}
          renderPagination={this.renderPagination}
          loop={false}
        >
          {this.renderImages()}
        </Swiper>
        {/* :
        null} */}
        </View>
    )
  }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    },
    image: {
      width:"100%",
      //height:"100%",
      resizeMode: "cover",
      flex: 1
    },
    paginationStyle: {
      position: 'absolute',
      bottom: 10,
      right: 10
    },
    paginationText: {
      color: 'white',
      fontSize: 20
    }
  })