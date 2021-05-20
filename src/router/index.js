import { createRouter, createWebHistory } from 'vue-router'

// route-level code splitting
const Home = () => import('../components/Home.vue');
const CommentsList = () => import('../components/CommentsList.vue');

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/news' },
        { path: '/news/:page?', name: 'news', component: Home },
        { path: '/newest/:page?', name: 'newest', component: Home },
        { path: '/show/:page?', name: 'show', component: Home },
        { path: '/ask/:page?', name: 'ask', component: Home },
        { path: '/jobs/:page?', name: 'jobs', component: Home },
        { path: '/item/:id', name: 'commentsList', component: CommentsList },
    ],
    linkActiveClass: 'header-link-active',
});
