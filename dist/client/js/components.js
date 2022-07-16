Vue.component("custom-button", {
	props: {
		role: {
			default: "primary"
		},
		icon: {}
	},
	template: `
<button class="d-flex flex-row align-items-center justify-content-center font-weight-bold" v-bind:class="'btn btn-' + role" v-on="$listeners">
<i v-if=icon class="d-flex flex-row align-items-center justify-content-center pr-2" v-bind:class="'bi bi-' + icon"></i>
<slot></slot>
</button>
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
		invalidFeedback: {}
	},
	methods: {
		
	},
	template: `
<div>
	<label v-if="label" v-bind:for="id" class="mb-0 font-weight-light">{{label}}</label>
	<div class="inner-addon left-addon">
		<input ref="fse" v-bind:id="id" v-bind:type="type" v-bind:placeholder="placeholder" v-bind:required="required" class="form-control" spellcheck="false" autocomplete="off" autofill="off" v-on="$listeners">
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

/*v-bind:style="'top:' + (this.$refs.fse.offsetHeight) + 'px'"*/