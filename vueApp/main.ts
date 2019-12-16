import 'babel-polyfill'
import Vue from 'vue';
import vuetify from './vuetifyConfig';

//import "./styles/variables.scss";

//import appReg from './app.vue';
const appReg = require('./app.vue').default;

//import { Router } from './routes';

//vue-x
//import { getStoreBuilder } from "vuex-typex";
//import { RootState } from "./.vuex/rootStore";

const app = new Vue(<any>{
    vuetify,
//    router: Router,
    el: '#app',
    data: {},
    components: {
        'app-component' : appReg
    },
    //store: getStoreBuilder<RootState>().vuexStore()
});

console.log("Vue app loaded");