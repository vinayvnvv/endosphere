import axios from 'axios';
import { ENV } from './../env';

class HttpService {
    
    sendSmsOtp(mobile) {
        const data = {
            mobile
        }
        return axios.post(ENV.NODE_API_SERVER_HOST + 'otp/send', data);
    }

    retrySmsOtp(mobile) {
        const data = {
            mobile
        }
        return axios.post(ENV.NODE_API_SERVER_HOST + 'otp/retry', data);
    }

    verifySmsOtp(mobile, otp) {
        const data = {
            mobile, otp
        }
        return axios.post(ENV.NODE_API_SERVER_HOST + 'otp/verify', data);
    }

    addUser(user) {
        return axios.post(ENV.NODE_API_SERVER_HOST + 'user', user);
    }

    getUserXls() {
        return axios.get(ENV.NODE_API_SERVER_HOST + 'user/xls', {responseType: 'blob'});
    }
}
export const Http = new HttpService(); 