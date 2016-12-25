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
import co from 'co';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import DownloadTools from './downloadTools';
import DisplayAll from './displayAll';
import * as Progress from 'react-native-progress';
const RNFS = require('react-native-fs');
let _targetFiles = [];//主要是防止download 的时候state不能及时更新
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class ResourceList extends Component
{
    constructor(props,context)
    {
        super(props,context);
        this.state = {
            files:[],//已经存在的文件
            dataSource:ds.cloneWithRows([]),//显示的数据源
            targetFiles:[],//数据源的原始数据，比existsFiles多了一个exists属性
            existFiles:ds.cloneWithRows([]),//服务器上存在的记录
            modalVisible:true,
        };
    }
    getSDCardContent()
    {
        console.log("getSDCardContent");
        console.log(RNFS.DocumentDirectoryPath);
        RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                console.log('GOT RESULT', result);
                let temps = [];
                for(let i = 0;i<result.length;i++)
                {
                    console.log(i+" is file "+result[i].isFile());
                    if(result[i].isFile())
                    {
                        temps.push(result[i]);
                    }
                    console.log(JSON.stringify(result[i]));
                }
                this.setState({
                    files:temps,
                });
                this.constructeDataSource();
                co.wrap(this.download.bind(this))();
                // stat the first file
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }
    *getResourceList()
    {
        let postData = {
            dropPointId:this.props.dropPointId,
        };
        let resourceList = yield fetch("http://localhost:3010/api/appdemo/getResourceList",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(postData),
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
            existFiles:json.result,
        });
        this.getSDCardContent();
        console.log("result is "+JSON.stringify(json));
    }
    constructeDataSource()
    {
        if(this.state.existFiles.length == 0)
        {
            return;
        }
        let targetFiles = [];
        let needDownLoad = false;
        for(let i = 0;i<this.state.existFiles.length;i++)
        {
            let flag = false;
            for(let j = 0;j<this.state.files.length;j++)
            {
                if(this.state.existFiles[i].filename == this.state.files[j].name)
                {
                    targetFiles.push({
                        ...this.state.existFiles[i],
                        exists:0,// 0是已经下载完成
                        loading:1.0,
                    });
                    flag = true;
                    break;
                }
            }
            if(!flag)
            {
                targetFiles.push({
                    ...this.state.existFiles[i],
                    exists:1,//// 1是等待下载
                    loading:0.0
                });
                needDownLoad = true;
                console.log("need dowload is true");
            }
        }
        this.setState({
            targetFiles:targetFiles,
            dataSource:ds.cloneWithRows(targetFiles),
        });
        _targetFiles = targetFiles;
        if(needDownLoad)
        {
            co.wrap(this.download());
        }else{
            this.onClick();
        }

    }
    onClick()
    {
        const {navigator} = this.props;
        if(navigator)
        {
            navigator.push({
                name:"DropPointList",
                component:DisplayAll,
                params:{
                    files:this.state.targetFiles,
                }
            });
        }
    }
    // 更新进度条
    updateProgress(index,progress)
    {
        let targetFiles = this.state.targetFiles;
        targetFiles[index].loading = progress;
        targetFiles[index].exists = 2;//正在下载中
        this.setState({
            targetFiles:targetFiles,
            dataSource:ds.cloneWithRows(targetFiles),
        });
    }
    *download()
    {
        console.log("startDownload"+JSON.stringify(_targetFiles));
        let undownloadFiles = [];
        for(let i=0;i<_targetFiles.length;i++)
        {
            console.log(" i = "+i+" content is "+JSON.stringify(_targetFiles[i]) + " exist is "+_targetFiles[i].exists);
            if(_targetFiles[i].exists == 1)
            {
                undownloadFiles.push(_targetFiles[i].filename);
            }
        }
        console.log("database files IS "+JSON.stringify(_targetFiles));
        console.log("FILENAMES IS "+JSON.stringify(undownloadFiles));
        let postData = {
            fileNames:undownloadFiles,
        };
        let urls = yield fetch("http://localhost:3010/api/appdemo/getFilesUrl",{
            method:"POST",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
            credentials: 'include',
        });
        let json = yield urls.json();
        json = json.result;
        console.log("url is "+JSON.stringify(json));
        let downloadTools = new DownloadTools();
        for(let i=0;i<_targetFiles.length;i++)
        {
            if(_targetFiles[i].exists == 1)
            {
                console.log("call for download function");
                downloadTools.startDownload(
                                            i,
                                            json[i].url,
                                            _targetFiles[i].filename,
                                            this.getSDCardContent.bind(this),
                                            this.updateProgress.bind(this));
            }
        }
    }
    componentDidMount()
    {
        console.log("did Mount");
        co(this.getResourceList());

    }
    render()
    {
        let titleConfig = {
            title: '资源下载',
        };
        return (
            <View style={{flex:10,flexDirection:"column",justifyContent:"space-around"}}>
                <NavigationBar
                    title={titleConfig}
                    rightButton={(
                        <Icon.Button
                                style={{backgroundColor:"white"}}
                                name="download"
                                onPress={co.wrap(this.download).bind(this)}
                                size={30}
                                color="green" />)}
                />
                <ListView
                    style={{flex:7,borderBottomColor:"yellow",borderBottomWidth:3}}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData)=>(
                        <View style={styles.container}>
                            <View style={styles.rowStyle}>
                                <Text style={styles.fontStyle1}>
                                    {rowData.filename}
                                </Text>
                                <Text style={styles.fontStyle2}>
                                   {rowData.exists == 0 ? "已经下载": rowData.exists == 1 ? "等待下载" : "下载中..."}
                                </Text>
                            </View>
                            {rowData.exists == 0 ? (<Text />) : (<Progress.Bar progress={rowData.loading} style={styles.progress}></Progress.Bar>)}
                        </View>
                    )}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    fontStyle1:{
        flex:6,
        fontWeight: 'bold',
        fontSize: 20,
    },
    buttonStyle:{
        color:"black",
        flex:2
    },
    fontStyle2:{
        flex:2,
        fontWeight: 'bold',
        fontSize: 20,
    },
    rowStyle:{
        flexDirection:"row",
        flex:8,
        justifyContent:"space-around",
        marginTop:10,
        alignItems:"center",
        borderBottomWidth:2,
        borderBottomColor:"green",
    },
    columnStyle:{
        flexDirection:'column',
        justifyContent:"flex-start",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
    },
    progress: {
        margin: 10,
    },
});
export default (ResourceList)