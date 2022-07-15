let register = {
		data() {
			return {
				usernameValid: true,
        passwordValid: true,
        password2Valid: true,
				config: {
					validUsernameMessage: "Looks good.",
					invalidUsernameMessage: "Invalid username.",
					validPasswordMessage: "Looks good.",
					invalidPasswordMessage: "Invalid password.",
          validPassword2Message: "Looks good.",
          invalidPassword2Message: "Invalid password",
					minUsernameLength: 6,
					maxUsernameLength: 24,
					minPasswordLength: 6,
					maxPasswordLength: 24
				}
			}
		},
		methods: {
			validateUsername: function(event) {
				let input = $(event.target);

				let validate = () => {
					input.addClass("is-valid");
					input.removeClass("is-invalid");
					this.usernameValid = true;
				}

				let invalidate = () => {
					input.addClass("is-invalid");
					input.removeClass("is-valid");
					this.usernameValid = false;
				}

        // Check if valid or not
				if (input.val().length >= this.config.minUsernameLength && input.val().length <= this.config.maxUsernameLength) {
					validate();
				} else {
					invalidate();
				}

        // If input is empty, remove validation indicators
        if (input.val().length == 0) {
          input.removeClass("is-valid");
          input.removeClass("is-invalid");
        }

        // Edit validation messages
				if (input.val().length < this.config.minUsernameLength) {
					this.config.invalidUsernameMessage = `Username must be ${this.config.minUsernameLength} characters above.`;
				} else if (input.val().length < this.config.maxUsernameLength) {
					this.config.invalidUsernameMessage = `Username must be ${this.config.maxUsernameLength} characters below.`;
				}
			},
			validatePassword: function(event) {
				let input = $(event.target);

				let validate = () => {
					input.addClass("is-valid");
					input.removeClass("is-invalid");
					this.passwordValid = true;
				}

				let invalidate = () => {
					input.addClass("is-invalid");
					input.removeClass("is-valid");
					this.passwordValid = false;
				}

        // Check if valid or not
				if (input.val().length >= this.config.minPasswordLength && input.val().length <= this.config.maxPasswordLength) {
					validate();
				} else {
					invalidate();
				}

        // If input is empty, remove validation indicators
        if (input.val().length == 0) {
          input.removeClass("is-valid");
          input.removeClass("is-invalid");
        }

        // Edit validation messages
				if (input.val().length < this.config.minPasswordLength) {
					this.config.invalidPasswordMessage = `Password must be ${this.config.minPasswordLength} characters above.`;
				} else if (input.val().length < this.config.maxPasswordLength) {
					this.config.invalidPasswordMessage = `Password must be ${this.config.maxPasswordLength} characters below.`;
				}
			},
      confirmPassword: function (event) {
        let confirmInput = $(event.target);
        let passwordInput = $("#registerPassword");

        let validate = () => {
          confirmInput.addClass("is-valid");
          confirmInput.removeClass("is-invalid");
          this.password2Valid = true;
        }

        let invalidate = () => {
          confirmInput.addClass("is-invalid");
          confirmInput.removeClass("is-valid");
          this.password2Valid = false;
        }

        if (confirmInput.val() == passwordInput.val()) {
          validate();
        } else {
          invalidate();
          this.config.invalidPassword2Message = "Password doesn't match.";
        }

        // If input is empty, remove validation indicators
        if (confirmInput.val().length == 0) {
          confirmInput.removeClass("is-valid");
          confirmInput.removeClass("is-invalid");
        }
      }
		}
};

$.ajaxSetup({async: false});
$.get("../js/views/register.html", function(data) {
  register.template = data;
}, "html");