import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import moment, {now} from 'moment';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {useSelector, useDispatch} from 'react-redux';

import Constant from '../Constant/Constant';

const update_last_msg = async (user_id, friend_id, type, message) => {
  firestore()
    .collection('HomeList')
    .where('user_id', '==', user_id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        firestore()
          .collection('HomeList')
          .doc(documentSnapshot.id)
          .update({
            last_msg:
              type === 'message' ? message : type === 'image' ? 'Photo' : '',
            last_msg_time: moment().format('DD-MM-YYYY HH:MM:SS A').toString(),
          })
          .then(() => {
            console.log('User Data updated!');
          });
      });
    });
  firestore()
    .collection('HomeList')
    .where('user_id', '==', friend_id)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        push_notification(
          documentSnapshot.data().token,
          documentSnapshot.data().full_Name,
          message,
          type,
        );
        firestore()
          .collection('HomeList')
          .doc(documentSnapshot.id)
          .update({
            last_msg:
              type === 'message' ? message : type === 'image' ? 'Photo' : '',
            last_msg_time: moment().format('DD-MM-YYYY HH:MM:SS A').toString(),
          })
          .then(() => {
            console.log('User Data updated!');
          });
      });
    });
};

const push_notification = async (token, full_Name, message, type) => {
  var axios = require('axios');
  var data = JSON.stringify({
    to: String(token),
    message: {
      sound: 'default',
      body: 'test body',
      title: 'test title 1',
      content_available: true,
      priority: 'high',
    },
    data: {
      sound: 'default',
      body: 'test body',
      title: 'test title 2',
      content_available: true,
      priority: 'high',
    },
    notification: {
      sound: 'default',
      playSound: true,
      body: type === 'message' ? message : type === 'image' ? 'Photo' : '',
      title: full_Name,
      content_available: true,
      priority: 'high',
    },
  });

  var config = {
    method: 'post',
    url: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      Authorization:
        'key=AAAAAHVOWXo:APA91bH-jPe-GH2f75dsb8DIs3hhNgcbJdR7G7LO2xFdpMHKZBua4073wEZ3yk-uk_1yn20I2Oks3gO00IQU7stwcgt5oVthzkALIE9O4ftsVr_GHtOsa7glw0uF6AMPlxapALAUjlD8',
      'Content-Type': 'application/json',
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

const image_upload_firebase = async (
  image,
  current_room_id,
  friend_id,
  userData,
) => {
  let refernce_image = `image/${Date.now()}${
    image.path.split(Constant.app_file_locaton)[1]
  }`;
  let reference = storage().ref(refernce_image);
  let task = reference.putFile(image.path);
  task
    .then(() => {
      _image_link_genrator(
        image,
        current_room_id,
        refernce_image,
        friend_id,
        userData,
      );
    })
    .catch(e => console.log('uploading image error => ', e));
};

const _image_link_genrator = async (
  image,
  current_room_id,
  refernce_image,
  friend_id,
  userData,
) => {
  const url = await storage().ref(refernce_image).getDownloadURL();

  const chatRef = database().ref('Chat').child(`${current_room_id}`);
  const data = {
    time: moment().format('DD-MM-YYYY HH:MM:SS A').toString(),
    from: userData.user_id,
    type: 'image',
    link: url,
    image_height: image.height,
    image_width: image.width,
    size: image.size,
  };
  update_last_msg(userData.user_id, friend_id, 'image', '');
  chatRef.push(data);
};

const _update_fmc_token = async (token) => {
  console.log(token);
}

export default {update_last_msg, image_upload_firebase,_update_fmc_token};
