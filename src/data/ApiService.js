import Axios from 'axios'

const axios = Axios.create()
//increased to 600 seconds because of "distibution" data pull
axios.defaults.timeout = 600000

class ApiService {
    configureBaseUrl = () => {
        let server = '/'

        const isLocalhost = Boolean(
            window.location.hostname === 'localhost' ||
                // [::1] is the IPv6 localhost address.
                window.location.hostname === '[::1]' ||
                // 127.0.0.1/8 is considered localhost for IPv4.
                window.location.hostname.match(
                    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
                )
        )
        if (isLocalhost) {
            server = 'http://localhost:8000/api/'
        } else {
            server = '/api/'
        }

        return server
    }

    axiosCall = async (route, body = {}, id = '', method = 'post') => {
        let url = this.configureBaseUrl() + route + (id !== '' ? '/' + id : '')
        try {
            let res = await axios({
                url,
                method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                data: body,
                withCredentials: false
            })
            return res.data
        } catch (err) {
            console.error('Failed to retrieve api data', err)
            if (err.response) {
                throw err.response.data
            } else {
                throw new Error('Network Error: Please check your connection.')
            }
        }
    }

    post = async (route, body = {}, id = '') => {
        if (!route) {
            console.log('Invalid route provided!')
            return
        }
        return await this.axiosCall(route, body, id, 'post')
    }

    get = async (route, id = '') => {
        if (!route) {
            console.log('Invalid route provided!')
            return
        }
        return await this.axiosCall(route, {}, id, 'get')
    }
}

const apiService = new ApiService()

export default apiService
