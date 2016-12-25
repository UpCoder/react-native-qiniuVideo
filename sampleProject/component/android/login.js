'use strict';
/**
 * Created by Liang on 2016/12/19.
 */
import React,{Component} from 'react';
import co from 'co';
import {
    AlertIOS,
    AppRegistry,
    StyleSheet,
    ScrollView,
    Image,
    TouchableHighlight,
    TextInput,
    Text,
    ListView,
    View,
    Touchable
} from 'react-native';
import Button from 'react-native-button';
import DropPointList from './dropPointList';
import ToastLDAndroid from './testToast';
import Environment from '../environment';
class Login extends Component
{
    constructor(props,context)
    {
        super(props,context);
        this.state={
            name:"admin",
            password:"admin",
        };
    }
    *onClick()
    {
        console.log("toastldandroid will execute");
        ToastLDAndroid.show('Awesome', ToastLDAndroid.SHORT);
        console.log("ok click"+Environment.BASE_URL+"/login");
        let postData={
            username:this.state.name,
            password:this.state.password,
        };
        let loginResult = yield fetch(Environment.BASE_URL+"/login",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
            credentials: 'include',
        }).catch((err)=>{
            console.log("happen error"+err+JSON.stringify(err));
        });
        var json = yield loginResult.json();

        if (json.err) {
            console.log("json error"+err);
            return;
        }
        console.log("json successful"+json);
        const {navigator} = this.props;
        if(navigator)
        {
            navigator.push({
                name:"DropPointList",
                component:DropPointList,
                params:null,
            });
        }
    }
    render()
    {
        return (
          <View style={{flex:1,flexDirection:"column",justifyContent:"center"}}>
              <View style={{flexDirection:"row",height:40,alignItems:"center"}}>
                  <Text style={{flex:1}}>{"账号"}</Text>
                  <TextInput style={{height:40,flex:8}}
                             placeholder="输入账号"
                             type="text"
                             autocapitalize="none"
                             autoCorrect={false}
                             autoFocus={true}
                             onChangeText={(text)=>{this.setState({name:text})}}
                             value={this.state.name} />
              </View>
              <View style={{flexDirection:"row",height:40,alignItems:"center"}}>
                  <Text style={{flex:1}}>{"密码"}</Text>
                  <TextInput style={{height:40,flex:8}}
                             placeholder="输入密码"
                             type="password"
                             autocapitalize="none"
                             autoCorrect={false}
                             onChangeText={(text)=>{this.setState({password:text})}}
                             value={this.state.password} />
              </View>
              <View>
                  <Button style={{fontSize: 20, color: 'green',borderWidth:1,borderColor:"green"}}
                          containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:20, backgroundColor: 'white'}}
                          styleDisabled={{color: 'red'}}
                          onPress={co.wrap(this.onClick).bind(this)}>
                      {"登陆"}
                  </Button>
              </View>

          </View>
        );
    }
}
export default (Login)