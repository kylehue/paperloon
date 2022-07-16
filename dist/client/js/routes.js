const routes = [{
	name: "Paperloon | Home",
	path: "/",
	component: home
}, {
	name: "Paperloon | Login",
	path: "/login",
	component: login
}, {
	name: "Paperloon | Register",
	path: "/register",
	component: register
}];

const router = new VueRouter({
	routes: routes,
	mode: "history",
	base: "/"
});

router.beforeEach((to, from, next) => {
  document.title = to.name;
  next();
});

const app = new Vue({
	el: "#app",
	router: router
});