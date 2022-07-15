const routes = [{
	path: '/',
	component: home
}, {
	path: '/login',
	component: login
}, {
	path: '/register',
	component: register
}];

const router = new VueRouter({
	routes: routes,
	mode: 'history',
	base: '/'
});

const app = new Vue({
	el: '#app',
	router: router
});