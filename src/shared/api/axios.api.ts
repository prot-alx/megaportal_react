import axios from 'axios'
import { baseURL, headers } from '../constants/api'


export const instance = axios.create({
    baseURL: baseURL,
    headers: headers
})
