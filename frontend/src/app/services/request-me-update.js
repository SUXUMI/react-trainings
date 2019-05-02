import axios from './http-service'
import getLocalStorageToken from '../assets/token'

const requestMeUpdate = (meState, setMeState) => {
    try {
        axios.defaults.headers.common['token'] = getLocalStorageToken()

        axios.get('/me')
            .then(result => {
                setMeState({
                me: result.data.me,
                loaded: true,
                })
            })
            .catch(e => {
                setMeState({
                ...meState,
                loaded: true,
                })

                try {
                console.log('error:', e.response.data[ Object.keys(e.response.data)[0] ])
                }
                catch (e) {
                console.log('error: ', e.message);
                }
            })
    }
    catch(e) {
        console.log('error: ', e.message);
    }
}

export default requestMeUpdate