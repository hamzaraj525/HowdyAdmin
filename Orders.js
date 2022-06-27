import React, {Component} from 'react';
import {
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
// import PushNotification from 'react-native-push-notification';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      close: false,
    };
  }
  componentDidMount() {
    var newArray = [];

    firestore()
      .collection('cartItems')
      .get()
      .then(querySnapshot => {
        console.log('Total order: ', querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {
          newArray.push(documentSnapshot.data());
        });
      })
      .then(testing => {
        console.log('New Array Push is =', newArray);
        this.setState({list: newArray});
      })
      .catch(error => {
        console.log(error);
        alert('Your Network Connection Is Not Good');
      });

    // database()
    //   .ref('/fishMenu')
    //   .on('value', snapshot => {
    //     var li = [];
    //     snapshot.forEach(child => {
    //       // console.log(child.val());
    //       li.push({
    //         key: child.key,
    //         Title: child.val().Title,
    //         Price: child.val().Price,
    //         items: child.val().items,
    //         SubTitle: child.val().SubTitle,
    //       });
    //       //   if (child.val().age > 6) {
    //       //     this.notifyHost();
    //       //   } else {
    //       //     this.handleNotification();
    //       //   }
    //     });
    //     console.log('done');
    //     this.setState({list: li});
    //   });
  }
  //   notifyHost = (item, index) => {
  //     PushNotification.cancelAllLocalNotifications();
  //     PushNotification.localNotification({
  //       channelId: 'test-channel',
  //       title: 'Host App',
  //       message: 'A New Patient is weak In the List ',
  //       color: 'blue',
  //     });
  //   };
  //   handleNotification = (item, index) => {
  //     PushNotification.localNotification({
  //       channelId: 'test-channel',
  //       title: 'Host App',
  //       message: 'A New Patient is Added In the List ',
  //       color: 'blue',
  //     });
  //   };
  //   note = (item, index) => {
  //     PushNotification.localNotification({
  //       channelId: 'test-channel',
  //       title: 'Host App',
  //       message: 'A Patient is Deleted In the List ',
  //       color: 'blue',
  //     });
  //   };

  deleteUser = Item => {
    database()
      .ref('fishMenu/' + Item.key)
      .remove()
      .then(() => {
        // this.note();
        console.log(Item);
      })
      .catch(err => {
        console.log(err);
      });
  };

  //   actionOnRow = item => {
  //     var Name = item.name;
  //     var Age = item.age;
  //     var Gender = item.gender;
  //     var contact = item.contact;
  //     var DDate = item.date;

  //     // alert(Name + '\n' + Gender + '\n' + contact + '\n' + Age);
  //     this.props.navigation.navigate('graphScreen', {
  //       Name,
  //       Age,
  //       DDate,
  //     });
  //   };
  header = ({item, index}) => {
    return (
      <Text
        style={{
          color: 'black',
          alignSelf: 'center',
          fontWeight: '700',
          fontSize: 25,
        }}>
        Orders
      </Text>
    );
  };
  renderUser = ({item, index}) => {
    return (
      <TouchableOpacity
        // onPress={() => this.actionOnRow(item)}
        style={{
          borderRadius: 9,
          margin: 11,
          backgroundColor: 'pink',
          flex: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{color: 'black', fontSize: 18}}>{item.Title}</Text>
        <Text style={{color: 'black', fontSize: 18}}>{item.Price}</Text>
        <Text style={{color: 'black', fontSize: 18}}>{item.Img}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    const {list} = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.list}
          keyExtractor={item => item.key}
          renderItem={this.renderUser}
          ListHeaderComponent={this.header}
          extraData={this.state.list}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 8,
  },
  container: {
    marginTop: 22,
    flex: 1,
  },
  loginBtn: {
    width: 25,
    height: 25,
    marginTop: '7%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    marginBottom: '2%',
    borderRadius: 22,
    backgroundColor: '#fff',
  },
});
