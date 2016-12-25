# react-native-qiniuVideo
### 这是我第一次使用React-Native，算是小试牛刀吧。下面是我在开发过程中遇到的一些问题：
- IOS默认限制使用Https协议：
   对于我们自己开发的服务器来说，https明显成本太高，目前在自己搞的小项目里面还是http协议较多，那么怎么修改这个设置呢？
  - 用Xcode打开IOS目录下的项目文件
  - 在Info.plist中添加NSAppTransportSecurity类型Dictionary。 
  - 在NSAppTransportSecurity下添加NSAllowsArbitraryLoads类型Boolean,值设为YES
- android x86结构的虚拟机启动不起来？
   这个是因为我安装了docker，docker的virtual box和安卓的虚拟机有冲突，导致android 的虚拟机总是启动不起来，关闭docker服务即好。

### 在这个sample中我们主要会用到以下几个库：
- react-native-fs (用来管理文件的，也可以用来上传下载文件)
- react-native-file-download(用来下载文件的，是将react-native-fs又封装了一层，只能用于IOS)
- react-native-video(用来播放视频，这里要注意我们要将react的版本调至15.3，不能使用15.4因为rnv 好像和15.4有冲突，导致onEnd、onProgress等回调函数不能被调用)
- react-native-progress(用来显示下载进度条)
 
### 安装步骤
- cd sampleProject/
- npm install
- react-native run-ios(react-native run-android)
