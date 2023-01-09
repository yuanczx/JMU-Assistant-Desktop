import {useRouter, createRouter, createWebHashHistory} from "vue-router";
import Login from "../pages/Login.vue";
import Course from "../pages/Course.vue";
import Home from "../pages/Menu.vue";

const routes = [
    {
        path: '/',
        component: Login,
        name:"Login"
    },
    {
        path: '/course',
        component: Course,
        name:"Course"
    },
    {
        path:'/home',
        component: Home,
        name:'Home'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})


export default router