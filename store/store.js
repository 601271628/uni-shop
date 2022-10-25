import Vue, { VueElement } from "vue"
import Vuex from "vuex"
import cart from "./cart.js"
Vue.use(Vuex)

const store = new Vuex.Store({
    state:{},
    getters:{},
    mutations:{},
    actions:{},
    modules:{
        cart
    }
})

export default store