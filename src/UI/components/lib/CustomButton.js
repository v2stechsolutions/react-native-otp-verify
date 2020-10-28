import React from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

const CustomButton = (props) => {
	const style = {};
	if (props.type === 'fill') {
		style.backgroundColor = 'blue';
		style.borderWidth = 0;
	} else if (props.type === 'default') {
		style.borderColor = colors.BLUE;
	} else if (props.type) {
		style.borderWidth = 0;
	}
	return (
		<TouchableOpacity
			onPress={props.onPress}
			style={[
				styles.buttonStyle,
				style,
				props.buttonStyle,
				props.disabled ? styles.disabled : {}
			]}>
			<Text style={[styles.textStyle, props.textStyle]}>
				{props.text}
			</Text>
		</TouchableOpacity>
	);
};

export default CustomButton;

const styles = StyleSheet.create({
	buttonStyle: {
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		borderWidth: 1,
		borderRadius: 3,
		justifyContent: 'center',
		alignItems: 'center'
	},
	textStyle: {
		textTransform: 'uppercase',
		fontSize: 16,
		color: '#fff'
	},
	disabled: {
		opacity: 0.5
	}
});

CustomButton.defaultProps = {
	type: 'default',
	disabled: false
};

CustomButton.propTypes = {
	type: PropTypes.oneOf(['default', 'fill', 'link']).isRequired,
	buttonStyle: ViewPropTypes.style,
	textStyle: PropTypes.object,
	disabled: PropTypes.bool,
	onPress: PropTypes.func,
	text: PropTypes.string.isRequired
};
