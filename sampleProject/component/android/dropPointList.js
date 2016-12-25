/**
 * Created by Liang on 2016/12/19.
 */
import React,{Component} from 'react';
import {
    AlertIOS,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    ListView,
    Button,
    View
} from 'react-native';
import co from 'co';
import NavigationBar from 'react-native-navbar';
import ResourceList from './resourceList';
import Environment from '../environment';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class DropPointList extends Component
{
    constructor(props,context)
    {
        super(props,context);
        this.state = {
            dataSource:ds.cloneWithRows([]),
        };
        co(this.getResourceList());
    }
    *getResourceList()
    {
        let resourceList = yield fetch(Environment.BASE_URL+"/appdemo/getDropPointList",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        }).catch((err)=>{
            console.log("get resource list erro "+err);
        });
        if(!resourceList.ok)
        {
            console.log("happen err");
            return ;
        }
        let json = yield resourceList.json();
        console.log("result length is "+json.result.length);
        this.setState({
            dataSource:ds.cloneWithRows(json.result),
        });
        console.log("result is "+JSON.stringify(json));
    }
    _pressRow(rowData)
    {
        const {navigator} = this.props;
        if(navigator)
        {
            navigator.push({
                name:"ResourceList",
                component:ResourceList,
                params:{
                    dropPointId:rowData.id,
                },
            });
        }
    }

    _renderRow(rowData)
    {
        return (
            <TouchableHighlight underlayColor="rgba(34,26,38,0.1)" onPress={()=>{
                this._pressRow(rowData);
            }}>
                <View
                    style={styles.rowStyle}
                    onClick={this.onClick.bind(this)}>
                    <Text style={styles.fontStyle1}>
                        {rowData.position}
                    </Text>
                    <Text style={styles.fontStyle2}>
                        {" > "}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
    onClick()
    {

    }
    render()
    {
        let titleConfig = {
            title: '投放点列表',
        };
        return (
            <View style={{flex:10,flexDirection:"column",justifyContent:"space-around"}}>
                <NavigationBar
                    title={titleConfig}
                />
                <ListView
                    style={{flex:10,borderBottomColor:"yellow",borderBottomWidth:3}}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fontStyle1:{
        flex:9,
        fontWeight: 'bold',
        fontSize: 20,
    },
    fontStyle2:{
        flex:1,
        fontWeight: 'bold',
        fontSize: 20,
    },
    rowStyle:{
        flexDirection:"row",
        flex:10,
        justifyContent:"space-around",
        marginTop:10,
        alignItems:"center",
        borderBottomWidth:2,
        borderBottomColor:"green",
    },
    rowContainer:{
        flex:10,
        flexDirection:"column",
        height:200,
    }
})
export default (DropPointList)