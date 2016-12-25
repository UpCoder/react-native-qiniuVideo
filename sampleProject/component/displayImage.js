/**
 * Created by Liang on 2016/12/19.
 */
import React,{Component} from 'react';
import {
    AlertIOS,
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Text,
    ListView,
    Button,
    View
} from 'react-native';
class DisplayImage extends Component
{
    constructor(props,context)
    {
        super(props,context);
    }
    render()
    {
        return (
            <Text>
                {"displayImage"}
            </Text>
        );
    }
}
export default (DisplayImage);