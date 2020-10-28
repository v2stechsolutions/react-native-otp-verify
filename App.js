/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import OTPVerification from './src/UI/screens/OTPVerification';

const App = () => {
	const getHash = () => {
		RNOtpVerify.getHash()
			.then((hash) => {
				console.log('App.js: Application hash is=> ', hash);
				// console.log(`<#> Dear User,
        		// 1091 is your OTP for verification. (Remaining Time: 10 minutes and 0 seconds)
				//  ${hash[0]}`);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	getHash();

	return (
		<View style={styles.container}>
			<OTPVerification />
		</View>
	);
};

export default App;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});
