// https://fontawesome.com/icons?d=listing&m=free
import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faLeaf
} from '@fortawesome/free-solid-svg-icons'

library.add(faLeaf)

Vue.component('fa', FontAwesomeIcon);