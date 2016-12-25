/**
 * Created by Liang on 2016/12/20.
 */
const FileDownload = require('react-native-file-download');
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
        console.log("start download");
        FileDownload.addListener(URL, (info) => {
            updateProgress(index,(info.totalBytesWritten / info.totalBytesExpectedToWrite));
            console.log(`complete ${(info.totalBytesWritten / info.totalBytesExpectedToWrite * 100)}%`);
        });
        FileDownload.download(URL, DEST, fileName, headers)
            .then((response) => {
                console.log(`downloaded! file saved to: ${response}`);
                next();
                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
    }
}
export default (DownloadTools)