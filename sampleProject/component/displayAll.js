/**
 * Created by Liang on 2016/12/20.
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
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import DisplayVideo from './displayVideo';
const _titleConfig = {
    title: '播放',
};
class DisplayAll extends Component
{
    constructor(props,context)
    {
        super(props,context);
        this.state={
            currentDisplay:
                <View>
                    <NavigationBar
                        title={_titleConfig}
                        rightButton={(
                            <Icon.Button
                                    style={{backgroundColor:"white"}}
                                    name="download"
                                    size={30}
                                    color="green" />)}
                    />
                    <Text>loading...</Text>
                </View>
        }
    }
    componentWillMount()
    {
        if(this.props.files.length!=0)
        {
            let curFile = this.props.files[0];
            let filename = curFile.filename;
            let curElement = <DisplayVideo filename={filename}
                                           index={0}
                                           next={this.displayNext.bind(this)}></DisplayVideo>
            this.setState({
                currentDisplay:curElement
            });
        }
    }
    displayNext(index)
    {
        let curFile = this.props.files[(index+1)%this.props.files.length];
        let filename = curFile.filename;
        let curElement = <DisplayVideo filename={filename}
                                       index={index+1}
                                       next={this.displayNext.bind(this)}></DisplayVideo>
        this.setState({
            currentDisplay:curElement
        });
    }
    render()
    {
        return (
            this.state.currentDisplay
        );
    }
}
export default (DisplayAll);