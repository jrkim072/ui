import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: '',
        userId: '',
        login: false,
        nickname: '',
        money: '',
        address: ''
    },
    mutations: {
        login (state, {userId, accessToken}) {
            console.log(userId)
            console.log(accessToken)
            state.accessToken = accessToken;
            state.userId = userId;
            state.login = true;
            localStorage.setItem("accessToken", accessToken)

            axios.get(`http://localhost:8088/users/${state.userId}`).then(function (e) {
                console.log(e.data)
                state.nickname = e.data.nickname
                state.money = e.data.money
                state.address = e.data.address

                localStorage.setItem("nickname", e.data.nickname)
                localStorage.setItem("money", e.data.money)
                localStorage.setItem("address", e.data.address)

            })

        },
        logout (state) {
            state.accessToken = null;
            state.nickname = null;
            state.money = null;
            state.address = null;
            state.login = false;
            localStorage.removeItem("accessToken")
            localStorage.removeItem("nickname")
            localStorage.removeItem("money")
            localStorage.removeItem("address")

        }
    },
    actions: {
        login({commit}, {userId, userPw}) {

            var me = this
            var clientID = 'uengine-client'
            var clientSecret = 'uengine-secret'
            const clientCredentialBase64 = btoa(clientID + ':' + clientSecret)
            //OAuth 인증을 위한 Body 설정
            const body = `grant_type=password&username=${encodeURIComponent(userId)}&password=` + encodeURIComponent(userPw)
            // console.log(headers)
            console.log(body)

            return axios.post(`${window.API_HOST}/oauth/token`, body, {
                    headers: {
                        'Authorization': `Basic ${clientCredentialBase64}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            ).then(function (e) {
                // console.log(e)
                // console.log(e.data.access_token)
                if( e && e.data && e.data.access_token){
                    // state.userId = userId;
                    var accessToken = e.data.access_token;
                    // localStorage.setItem("jwtToken", me.jwtToken)
                    // me.formData.isLogin = true
                    console.log(accessToken)
                    commit('login', {userId, accessToken})

                    // 모든 HTTP 요청 헤더에 Authorization 을 추가한다.
                    axios.defaults.headers.common['Authorization'] = `Bearer ${e.data.accessToken}`;
                }
            })
        },
        logout ({commit}) {
            commit('logout')
        },
    }
})
