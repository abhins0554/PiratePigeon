import moment from 'moment';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';

import Color from '../Constant/Color';
import Constant from '../Constant/Constant';

export default function HomeList({
  navigation,
  pphoto,
  full_Name,
  last_msg,
  last_msg_time,
}) {
  const theme = useSelector(state => state.theme.theme);
  const styles = StyleSheet.create({
    listcontainer: {
      backgroundColor: theme === 'light' ? '#e6e6e6' : Color.secondary,
      width: Dimensions.get('window').width - 40,
      alignSelf: 'center',
      margin: 7.5,
      padding: 5,
      borderRadius: 5,
      flexDirection: 'row',
      alignContent: 'center',
    },
    listProfileImage: {
      height: 55,
      width: 55,
      borderRadius: 360,
    },
    listbody: {
      marginHorizontal: 10,
      flex: 1,
    },
    username: {
      fontSize: 16,
      fontWeight: '700',
      color: theme === 'light' ? Color.dark : Color.light,
    },
    msgtxt: {
      fontSize: 13,
      marginTop: 5,
      color: theme === 'light' ? Color.dark : Color.light,
    },
    ismsgboxindicator: {
      backgroundColor: Color.primary,
      height: 10,
      width: 10,
      borderRadius: 360,
      alignSelf: 'center',
      marginVertical: 5,
    },
    timetxt: {
      color: theme === 'light' ? Color.dark : Color.light,
      fontSize: 12,
      marginVertical: 5,
    },
  });
  return (
    <TouchableOpacity style={styles.listcontainer} onPress={navigation}>
      <Image
        source={pphoto ? {uri: pphoto} : Constant.User}
        style={styles.listProfileImage}
      />
      <View style={styles.listbody}>
        <Text style={styles.username} numberOfLines={1}>
          {full_Name ? full_Name : ''}
        </Text>
        <Text style={styles.msgtxt} numberOfLines={1}>
          {last_msg ? last_msg : ''}
        </Text>
      </View>
      <View style={{marginHorizontal: 5, justifyContent: 'center'}}>
        <Text style={styles.timetxt}>
          {last_msg_time
            ? moment(last_msg_time, 'DD-MM-YYYY HH:MM:SS A').format(
                'DD-MM-YYYY',
              ) === moment().format('DD-MM-YYYY')
              ? moment(last_msg_time, 'DD-MM-YYYY HH:MM:SS A').format('HH:MM A')
              : moment(last_msg_time, 'DD-MM-YYYY HH:MM:SS A').format(
                  'DD-MM-YYYY',
                )
            : ''}
        </Text>
        <View style={styles.ismsgboxindicator} />
      </View>
    </TouchableOpacity>
  );
}
