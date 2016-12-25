/**
 * Created by Liang on 2016/12/10.
 */
import React from 'react'
import Login from './login';
import {
    Navigator,
    ListView,
    View
} from 'react-native';
class InitialComponent extends React.Component
{
    render()
    {
        return (
            <Navigator initialRoute={{name:"firstPage",component:Login} }
                       configureScene={ (route)=>{return Navigator.SceneConfigs.VerticalUpSwipeJump;}}
                       renderScene={(route,navigator)=>{
                           let Component = route.component;
                           return <Component {...route.params} navigator={navigator}/>
                       }}></Navigator>
        );
    }
}
export default (InitialComponent);