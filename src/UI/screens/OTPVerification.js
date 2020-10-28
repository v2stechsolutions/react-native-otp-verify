import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Platform,
	ActivityIndicator,
	Pressable
} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import CustomButton from '../components/lib/CustomButton';
import CustomTextInput from '../components/lib/CustomTextInput';

const RESEND_OTP_TIME_LIMIT = 30; //seconds
const AUTO_SUBMIT_OTP_TIME_LIMIT = 4; //seconds

let resendOtpTimerInterval;
let autoSubmitOtpTimerInterval;

const OTPVerification = ({ otpRequestData, attempts }) => {
	const [attemptsRemaining, setAttemptsRemaining] = useState(attempts);
	const [otpArray, setOtpArray] = useState(['', '', '', '']);
	const [submittingOtp, setSubmittingOtp] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const [resendButtonDisableTime, setResendButtonDisableTime] = useState(
		RESEND_OTP_TIME_LIMIT
	);

	const [autoSubmitOtpTime, setAutoSubmitOtpTime] = useState(
		AUTO_SUBMIT_OTP_TIME_LIMIT
	);

	const inputRef1 = useRef(null);
	const inputRef2 = useRef(null);
	const inputRef3 = useRef(null);
	const inputRef4 = useRef(null);

	const autoSubmitOtpTimerIntervaCallbackRef = useRef();

	useEffect(() => {
		RNOtpVerify.getOtp()
			.then((p) => {
				RNOtpVerify.addListener((message) => {
					console.log(JSON.stringify(message, null, 4));
					try {
						if (message && message !== 'Timeout Error.') {
							const otp = /(\d{4})/g.exec(message)[1];
							if (otp.length === 4) {
								setOtpArray(otp.split(''));
								setAutoSubmitOtpTime(
									AUTO_SUBMIT_OTP_TIME_LIMIT
								);
								startAutoSubmitOtpTimer();
								// removing otp listener after successful reading of OTP
								// removeOtpListener();
							}
						} else {
							// handle timeout error here
							console.log(
								'OTPVerification: RNOtpVerify.getOtp - message=>',
								message
							);
						}
					} catch (error) {
						console.log(
							'OTPVerification: RNOtpVerify.getOtp error=>',
							error
						);
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
		return () => {
			removeOtpListener();
		};
	}, []);

	useEffect(() => {
		autoSubmitOtpTimerIntervaCallbackRef.current = autoSubmitOtpTimerIntervaCallback;
	});

	useEffect(() => {
		startResendOtpTimer();
		return () => {
			if (resendOtpTimerInterval) {
				clearTimeout(resendOtpTimerInterval);
			}
		};
	}, [resendButtonDisableTime]);

	const autoSubmitOtpTimerIntervaCallback = () => {
		if (autoSubmitOtpTime <= 0) {
			clearInterval(autoSubmitOtpTimerInterval);

			// submit OTP
			onSubmitButtonPress();
		}
		setAutoSubmitOtpTime(autoSubmitOtpTime - 1);
	};

	const startAutoSubmitOtpTimer = () => {
		if (autoSubmitOtpTimerInterval) {
			clearInterval(autoSubmitOtpTimerInterval);
		}
		autoSubmitOtpTimerInterval = setInterval(() => {
			autoSubmitOtpTimerIntervaCallbackRef.current();
		}, 1000);
	};

	const startResendOtpTimer = () => {
		if (resendOtpTimerInterval) {
			clearInterval(resendOtpTimerInterval);
		}
		resendOtpTimerInterval = setInterval(() => {
			if (resendButtonDisableTime <= 0) {
				clearInterval(resendOtpTimerInterval);
			} else {
				setResendButtonDisableTime(resendButtonDisableTime - 1);
			}
		}, 1000);
	};

	const refCallback = (textInputRef) => (node) => {
		textInputRef.current = node;
	};

	const onResendButtonClick = () => {
		if (inputRef1) {
			setOtpArray(['', '', '', '']);
			inputRef1.current.focus();
		}
		setResendButtonDisableTime(RESEND_OTP_TIME_LIMIT);
		startResendOtpTimer();
	};

	const onSubmitButtonPress = () => {
		console.log('otp submited', otpArray);
		// process otp here
	};

	const removeOtpListener = () => {
		console.log('Removing Otp Listener');
		RNOtpVerify.removeListener();
	};

	const onOptChange = (index) => {
		return (value) => {
			if (isNaN(Number(value))) {
				return;
			}
			const otpArrayCpy = otpArray.concat();
			otpArrayCpy[index] = value;
			setOtpArray(otpArrayCpy);
			if (value !== '') {
				if (index === 0) {
					inputRef2.current.focus();
				} else if (index === 1) {
					inputRef3.current.focus();
				} else if (index === 2) {
					inputRef4.current.focus();
				}
			}
		};
	};

	const onOTPKeyPress = (index) => {
		return ({ nativeEvent: { key: value } }) => {
			if (value === 'Backspace' && otpArray[index] === '') {
				if (index === 1) {
					inputRef1.current.focus();
				} else if (index === 2) {
					inputRef2.current.focus();
				} else if (index === 3) {
					inputRef3.current.focus();
				}
				if (Platform.OS === 'android' && index > 0) {
					const otpArrayCpy = otpArray.concat();
					otpArrayCpy[index - 1] = '';
					setOtpArray(otpArrayCpy);
				}
			}
		};
	};
	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>OTP Verification</Text>
			<View style={{ marginTop: 20, alignItems: 'center' }}>
				<Text style={styles.messageText1}>
					Enter the verification code we
				</Text>
				<Text style={styles.messageText1}>
					just sent you on your mobile number.
				</Text>
			</View>
			<View style={styles.inputView}>
				{[inputRef1, inputRef2, inputRef3, inputRef4].map(
					(inputRef, i) => (
						<CustomTextInput
							refCallback={refCallback(inputRef)}
							onChangeText={onOptChange(i)}
							onKeyPress={onOTPKeyPress(i)}
							value={otpArray[i]}
							keyboardType="numeric"
							textContentType="oneTimeCode"
							maxLength={1}
							key={i}
							autoFocus={i === 0 ? true : undefined}
							inputStyle={styles.inputStyle}
							containerStyle={{ flex: 0.15 }}
						/>
					)
				)}
			</View>
			<View style={styles.resendTextView}>
				{resendButtonDisableTime > 0 ? (
					<Text>Resend OTP in {resendButtonDisableTime}</Text>
				) : (
					<Pressable onPress={onResendButtonClick}>
						<Text style={[styles.messageText2, styles.resendStyle]}>
							Resend OTP!
						</Text>
					</Pressable>
				)}
			</View>
			{errorMessage ? (
				<Text
					style={[
						GenericStyles.negativeText,
						GenericStyles.centerAlignedText
					]}>
					{errorMessage}
				</Text>
			) : null}
			<View style={{ marginTop: 10, marginBottom: 10 }}>
				{submittingOtp && <ActivityIndicator size={50} color="blue" />}
				{autoSubmitOtpTime > 0 &&
				autoSubmitOtpTime < AUTO_SUBMIT_OTP_TIME_LIMIT ? (
					<Text>Submitting OTP in {autoSubmitOtpTime}</Text>
				) : null}
			</View>
			<CustomButton
				buttonStyle={styles.submitButton}
				text="Submit"
				type="fill"
				onPress={onSubmitButtonPress}
				textStyle={styles.submitText}
			/>
		</View>
	);
};

export default OTPVerification;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerText: {
		color: '#3d485a',
		fontSize: 24,
		fontWeight: 'bold'
	},
	messageText1: {
		color: '#3d485a',
		fontSize: 20
	},
	messageText2: {
		color: '#b7b9be',
		fontSize: 18,
		textAlign: 'center'
	},
	inputView: {
		marginTop: 20,
		width: '100%',
		paddingHorizontal: 20,
		justifyContent: 'space-evenly',
		flexDirection: 'row'
	},
	inputStyle: {
		fontSize: 16,
		textAlign: 'center',
		color: '#000000'
	},
	resendTextView: {
		width: '100%',
		marginTop: 20,
		marginBottom: 20
	},
	resendStyle: {
		fontWeight: 'bold',
		color: '#ff463e',
		marginLeft: 10
	}
});
