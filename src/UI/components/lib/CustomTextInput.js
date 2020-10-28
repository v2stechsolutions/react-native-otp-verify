import React from 'react';
import { StyleSheet, Text, TextInput, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { GenericStyles } from '../../../styles/GenericStyles';

const CustomTextInput = (props) => {
	const {
		containerStyle,
		inputStyle,
		LeftComponent,
		RightComponent,
		refCallback,
		...remainingProps
	} = props;
	return (
		<View style={[styles.containerStyle, containerStyle]}>
			{LeftComponent}
			<TextInput
				{...remainingProps}
				style={[styles.textInput, GenericStyles.fill, inputStyle]}
				ref={refCallback}
			/>
			{RightComponent}
		</View>
	);
};

const styles = StyleSheet.create({
	containerStyle: {
		flexDirection: 'row',
		borderColor: '#d4d4d4',
		borderWidth: 1,
		borderRadius: 4,
		padding: 8
	},
	textInput: {
		padding: 0
	}
});

CustomTextInput.defaultProps = {
	LeftComponent: <></>,
	RightComponent: <></>
};

CustomTextInput.propTypes = {
	containerStyle: ViewPropTypes.style,
	inputStyle: PropTypes.object,
	LeftComponent: PropTypes.object,
	RightComponent: PropTypes.object,
	refCallback: PropTypes.func,
	onChangeText: PropTypes.func
};

export default CustomTextInput;
