import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Для Android
import DateTimePicker from '@react-native-community/datetimepicker'; // Для iOS

const CustomDateTimePicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  const handleDateConfirm = (date) => {
    onChange(date);
    hideDateTimePicker();
  };

  const renderDateTimePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          onChange={(event, date) => onChange(date)}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <DateTimePickerModal
          isVisible={showPicker}
          mode="date"
          date={value}
          onConfirm={handleDateConfirm}
          onCancel={hideDateTimePicker}
        />
      );
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={showDateTimePicker} style={styles.button}>
        <Text style={styles.buttonText}>Выбрать дату</Text>
      </TouchableOpacity>
      {renderDateTimePicker()}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default CustomDateTimePicker;
