Vue.component("custom-button", {
	props: {
		role: {
			default: "primary"
		},
		to: {
			default: "#"
		},
		icon: {}
	},
	methods: {
		setActive: function () {
			let btn = $(this.$el);
			let parent = btn.parent();
			console.log(parent)
			if (parent.hasClass("nav-item")) {
				let ul = parent.parent();
				ul.find("li").removeClass("active");
				parent.addClass("active");


			}
		}
	},
	template: `
<router-link tag="button" v-on:click.native="setActive()" v-bind:to="to" class="d-flex flex-row align-items-center justify-content-center font-weight-bold w-100" v-bind:class="'btn btn-' + role" v-on="$listeners">
<i v-if=icon class="d-flex flex-row align-items-center justify-content-center pr-2" v-bind:class="'bi bi-' + icon"></i>
<slot></slot>
</router-link>
  `
});

Vue.component("form-input", {
	props: {
		id: {},
		type: {
			default: "text"
		},
		icon: {},
		label: {},
		placeholder: {},
		required: {
			default: true
		},
		oninput: {},
		validFeedback: {},
		invalidFeedback: {},
		focus: {}
	},
	mounted() {
  	if (this.focus) {
  		this.$refs.input.focus();
  	}
  },
	methods: {

	},
	template: `
<div>
	<label v-if="label" v-bind:for="id" class="mb-0 font-weight-light">{{label}}</label>
	<div class="inner-addon left-addon">
		<input ref="input" v-bind:id="id" v-bind:type="type" v-bind:placeholder="placeholder" v-bind:required="required" class="form-control" spellcheck="false" autocomplete="off" autofill="off" v-on="$listeners">
		<i v-if=icon v-bind:class="'bi bi-' + icon"></i>
		<div class="valid-feedback pe-none user-select-none">
			{{validFeedback}}
		</div>
		<div class="invalid-feedback pe-none user-select-none">
			{{invalidFeedback}}
		</div>
	</div>
</div>
  `
});


Vue.component("nav-list", {
	props: {
		
	},
	methods: {

	},
	template: `
	<li class="nav-item">
			<slot></slot>
	</li>
  `
});

Vue.component("custom-nav", {
	props: {

	},
	methods: {

	},
	mounted() {
		window.addEventListener("click", event => {
			let navbarToggler = $(this.$refs.navbarToggler);
			if (!navbarToggler.hasClass("collapsed")) {
				navbarToggler.trigger("click");
			}
		});
	},
	template: `
<nav ref="navbar" class="navbar navbar-expand-sm position-absolute navbar-dark bg-dark w-100 top-0">
  <router-link class="navbar-brand" to="/">
    <img src="../../assets/images/logo/logo-80.png" width="30" height="30" class="d-inline-block align-top" alt="">
    Paperloon
  </router-link>
  <button ref="navbarToggler" class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarNav">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav ml-auto">
    	<slot></slot>
    </ul>
  </div>
</nav>
  `
});