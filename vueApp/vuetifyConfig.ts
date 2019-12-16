import Vue from 'vue';

// -- vuetify --
import Vuetify from 'vuetify/lib'
Vue.use(Vuetify)

const opts = {
    theme: {
        themes: {
//            light: theme
        },
        customProperties: true,
    },
    icons: {
        iconfont: <"mdi">"mdi"
    }
}

export default new Vuetify(opts)