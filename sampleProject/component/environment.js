/**
 * Created by Liang on 12/24/16.
 */
let _Environments = {
    production:  {BASE_URL: '', API_KEY: ''},
    staging:     {BASE_URL: '', API_KEY: ''},
    development: {BASE_URL: 'http://192.168.1.105:3010/api', API_KEY: ''},
};
import {
    Platform,
} from 'react-native';
function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)
    //var platform = getPlatform();

    // ...now return the correct environment
    return _Environments["development"];
}
let Environment = getEnvironment();
export default Environment;