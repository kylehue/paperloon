Vue.component("btn", {
	props: {
		type: {
			default: "primary"
		},
		icon: {}
	},
	template: `
  <button v-bind:class="'btn btn-' + type">
  <i v-if=icon v-bind:class="'bi bi-' + icon"></i>
  <span v-if=icon>&nbsp;</span><slot></slot>
  </button>
  `
});