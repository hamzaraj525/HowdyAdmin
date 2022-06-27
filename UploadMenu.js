import React, {Component, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  FlatList,
  ImageBackground,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SwipeUpDownModal from 'react-native-swipe-modal-up-down';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';

export default class UploadMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      price: '',
      subtitle: '',
      category: '',
      Img: 'https://images.unsplash.com/photo-1560367918-bed51f9dff43?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1841&q=80',
      postTime: firestore.Timestamp.fromDate(new Date()),
      list: [],
      ShowComment: false,
      animateModal: false,
      isLoading: false,
      submitted: false,
      submit_loop: false,
      transferred: 0,
      uploading: true,
    };
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({isLoading: false});
  //   }, 3000);
  // }
  onPressButton = async () => {
    const imageUrl = await this.uploadImage();

    var count = '' + this.state.list.length;
    if (this.state.title.length > 0) {
      if (this.state.price.length > 0) {
        var count = firestore()
          .collection('fishMenu')
          .doc(count)
          .set({
            Title: this.state.title,
            Price: this.state.price,
            SubTitle: this.state.subtitle,
            Cat: this.state.category,
            Img: imageUrl,
            postTime: this.state.postTime,
            key: count,
          })
          .then(() => {
            alert('Item Added');
            console.log('Item added!');
          })
          .catch(error => {
            console.log(error);
          });

        // this.callfunctiontopopulateFlatList();
      } else {
        Alert.alert('Title can not be empty');
      }
    } else {
      Alert.alert('Price Name Cannot be empty');
    }
  };

  uploadImage = async () => {
    if (this.state.Img == null) {
      return null;
    }
    const uploadUri = this.state.Img;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      this.setState(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      this.setState(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      console.log('uploaded');
      return url;
    } catch (e) {
      console.log('not uploaded' + e);
      return null;
    }
  };

  openGallery = () => {
    // console.warn('uplaoded');
    ImagePicker.openPicker({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      width: 250,
      height: 400,
      cropping: true,
    }).then(image => {
      // console.log(image);
      const imageUri = image.path;
      this.setState({Img: imageUri});
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
          <ScrollView>
            <Text
              style={{
                marginBottom: '7%',
                marginTop: '7%',
                fontSize: 25,
                color: 'white',
                alignSelf: 'center',
                fontWeight: 'bold',
              }}>
              Upload Menu
            </Text>
            <View
              style={{
                alignSelf: 'center',
                marginBottom: 20,
              }}>
              <TouchableOpacity
                onPress={this.openGallery}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                  backgroundColor: '#F6F3F5',
                  borderRadius: 10,
                  width: 100,
                  height: 100,
                }}>
                <ImageBackground
                  style={{width: 100, height: 100}}
                  source={{uri: this.state.Img}}
                />
                {/* <MaterialCommunityIcons name="camera" size={30} color={'grey'} />
                 */}
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.passwordContainer,
                {alignSelf: 'flex-start', width: '30%'},
              ]}>
              <FontAwesome name="dollar" size={20} color={'pink'} />
              <TextInput
                placeholderTextColor="black"
                style={{marginLeft: 14}}
                placeholder="Price"
                value={this.state.price}
                onChangeText={price => this.setState({price})}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.setState({ShowComment: true})}
              style={styles.categBtn}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="apps-sharp" size={20} color={'pink'} />
                <Text
                  style={{
                    marginLeft: 6,
                  }}>
                  {this.state.category ? this.state.category : 'Category'}
                </Text>
              </View>
              <SimpleLineIcons name="arrow-down" size={10} color={'pink'} />
            </TouchableOpacity>
            <View style={[styles.passwordContainer, {width: '80%'}]}>
              <MaterialCommunityIcons name="pencil" size={20} color={'pink'} />
              <TextInput
                style={{width: '80%', marginLeft: 6}}
                value={this.state.title}
                onChangeText={title => this.setState({title})}
                placeholder="Title"
                placeholderTextColor="black"
              />
            </View>
            <View
              style={[
                styles.passwordContainer,
                {marginBottom: 0, width: '100%'},
              ]}>
              <AntDesign name="calendar" size={20} color={'pink'} />
              <TextInput
                placeholderTextColor="black"
                value={this.state.subtitle}
                style={{width: '90%', marginLeft: 6}}
                onChangeText={subtitle => this.setState({subtitle})}
                placeholder="subtitle"
              />
            </View>

            <TouchableOpacity
              onPress={() => this.onPressButton()}
              style={[
                styles.loginBtn,
                {marginTop: 15, backgroundColor: 'orange'},
              ]}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                POST
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => alert('Canceled')}
              style={[
                styles.loginBtn,
                {
                  marginTop: '5%',
                  backgroundColor: 'white',
                },
              ]}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: 'black',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <View>
              <SwipeUpDownModal
                modalVisible={this.state.ShowComment}
                PressToanimate={this.state.animateModal}
                ContentModalStyle={styles.Modal}
                ContentModal={
                  <View>
                    <View style={styles.containerContent}>
                      <View style={styles.exploreSection}>
                        <Text style={styles.exploreHeader}>
                          Select a Category
                        </Text>
                        <View style={styles.exploreContent}>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#f44a53'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'fish',
                              })
                            }>
                            <MaterialCommunityIcons
                              name="fish"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Fish</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#fb8634'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'kids',
                              })
                            }>
                            <MaterialCommunityIcons
                              name="car"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Kids</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#FACA2E'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'IceCreamShakes',
                              })
                            }>
                            <Fontisto name="camera" size={22} color={'white'} />
                            <Text style={styles.exploreText}>Shakes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#21D973'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'HotBeverages',
                              })
                            }>
                            <SimpleLineIcons
                              name="game-controller"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>HotBeverages</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {
                                marginRight: 'auto',
                                backgroundColor: '#32BBAC',
                                marginLeft: '7%',
                              },
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'ColdBeverage',
                              })
                            }>
                            <MaterialCommunityIcons
                              name="shoe-heel"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>ColdBeverage</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {
                                marginRight: 'auto',
                                backgroundColor: '#399CF0',
                                marginLeft: '7%',
                              },
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'dessert',
                              })
                            }>
                            <MaterialIcons
                              name="sports-basketball"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Dessert</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'fries',
                              })
                            }
                            style={[
                              styles.singleExplore,
                              {
                                marginRight: 'auto',
                                backgroundColor: '#3D6AE9',
                              },
                            ]}>
                            <MaterialCommunityIcons
                              name="headphones"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Fries</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'wraps',
                              })
                            }
                            style={[
                              styles.singleExplore,
                              {
                                marginLeft: '7%',
                                marginRight: 'auto',
                                backgroundColor: '#984DE6',
                              },
                            ]}>
                            <MaterialCommunityIcons
                              name="book-open-variant"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Wraps</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'wings',
                              })
                            }
                            style={[
                              styles.singleExplore,
                              {
                                marginLeft: '7%',
                                marginRight: 'auto',
                                backgroundColor: '#6C7C90',
                              },
                            ]}>
                            <Ionicons
                              name="tablet-landscape-outline"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Wings</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#f44a53'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'steaks',
                              })
                            }>
                            <MaterialCommunityIcons
                              name="fish"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Steaks</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#fb8634'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'chicken',
                              })
                            }>
                            <MaterialCommunityIcons
                              name="car"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Chicken</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#FACA2E'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'sandwich',
                              })
                            }>
                            <Fontisto name="camera" size={22} color={'white'} />
                            <Text style={styles.exploreText}>Sandwich</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#21D973'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'zingers',
                              })
                            }>
                            <SimpleLineIcons
                              name="game-controller"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Zingers</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#21D973'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'burgers',
                              })
                            }>
                            <SimpleLineIcons
                              name="game-controller"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Burgers</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.singleExplore,
                              {backgroundColor: '#21D973'},
                            ]}
                            onPress={() =>
                              this.setState({
                                ShowComment: true,
                                animateModal: true,
                                category: 'appetizers',
                              })
                            }>
                            <SimpleLineIcons
                              name="game-controller"
                              size={22}
                              color={'white'}
                            />
                            <Text style={styles.exploreText}>Appetizers</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                }
                onClose={() => {
                  this.setState({ShowComment: false});
                  this.setState({animateModal: false});
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F6F3F5',
    width: '70%',
    height: 45,
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  error: {
    borderWidth: 4,
    borderColor: 'red',
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: '100%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: 'orange',
  },
  categBtn: {
    width: '60%',
    flexDirection: 'row',
    borderRadius: 25,
    height: 50,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F6F3F5',
  },
  image: {
    marginBottom: 40,
    width: '38%',
    height: '20%',
  },
  labelInputText: {
    textAlign: 'left',
    marginVertical: 10,
    fontSize: 13,
  },
  Modal: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: '15%',
    backgroundColor: 'white',
  },
  modalInnerBtn: {
    width: '13%',
    borderRadius: 25,
    height: '6%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
    backgroundColor: 'orange',
  },
  containerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreSection: {
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  exploreHeader: {
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 18,
  },
  exploreContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  singleExplore: {
    height: 80,
    width: '28%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 1,
    backgroundColor: 'white',
    margin: 1,
    marginBottom: 20,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  exploreText: {
    fontSize: 13,
    color: 'white',
  },
  buttons: {
    width: 400,
    height: 150,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F6F3F5',
    borderRadius: 25,
    padding: 12,
    width: '100%',
    height: 60,
    marginBottom: 20,
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
  },
});
