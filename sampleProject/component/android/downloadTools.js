/**
 * Created by Liang on 2016/12/20.
 */
const RNFS = require('react-native-fs');
const DEST = RNFS.DocumentDirectoryPath;
const headers = {
    'Accept-Language': 'en-US'
};
class DownloadTools{
    constructor()
    {

    }
    startDownload(index,URL,fileName,next,updateProgress)
    {
        console.log("start download"+URL);
        let options = {};
        options.fromUrl = URL;
        options.toFile = DEST + "/" + fileName;
        options.headers = headers;
        options.progressDivider = 1;
        options.begin =(res: DownloadBeginCallbackResult) =>{
            console.log("start begin");
        };
        options.progress = (res: DownloadProgressCallbackResult) => {
            updateProgress(index,(res.bytesWritten / res.contentLength));
            console.log("progress");
        };
        RNFS.downloadFile(options);
    }
}
export default (DownloadTools)