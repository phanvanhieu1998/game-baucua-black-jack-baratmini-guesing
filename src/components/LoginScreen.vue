<template>
  <div class="login-screen">
    <div :class="{ bannerVerify: isWatting }" class="banner-login">
      <img :src="`${wp_theme_url}images/casino.png`" alt="#" />
    </div>

    <h1 class="title-login">LOGIN</h1>

    <div class="body-section">
      <div class="form-login">
        <el-form :model="login_form" ref="login_form" :rules="rules">
          <el-form-item prop="mobile_number">
            <el-input
              type="tel"
              class="login-input"
              v-model="login_form.mobile_number"
              placeholder="ENTER MOBILE NUMBER"
            />
          </el-form-item>
          <el-form-item prop="remember">
            <el-checkbox class="checkbox-login" v-model="login_form.remember"
              >REMEMBER ME</el-checkbox
            >
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" @click="doLogin" class="btn-login"
              >LET'S PLAY</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      @close="isWatting = false"
      append-to-body
      custom-class="verify-dialog"
      :visible.sync="dialogVisible"
    >
      <span>Enter verification code</span>
      <el-input type="tel" :maxlength="6" v-model="verify_code"></el-input>
      <span slot="footer" class="dialog-footer-login">
        <el-button :loading="verifiting" type="warning" @click="doVerify"
          >Submit</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      login_form: {
        mobile_number: "",
        remember: false,
      },
      dialogVisible: false,
      loading: false,
      verify_code: "",
      rules: {
        mobile_number: [
          {
            required: true,
            message: "Please enter your phone number",
            trigger: "blur",
          },
        ],
      },
      verifiting: false,
      isWatting: false,
    };
  },

  props: {
    msg: String,
  },

  computed: {
    wp_theme_url() {
      return this.$store.state.WP_THEME_APP_URL;
    },
  },

  methods: {
    doLogin() {
      this.$refs.login_form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("login", {
              phone: this.login_form.mobile_number,
              remember: this.login_form.remember,
            })
            .then((res) => {
              this.loading = false;
              this.dialogVisible = true;
              this.isWatting = true;
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              this.$message.error(error.response.data);
            });
        } else {
          return false;
        }
      });
    },
    doVerify() {
      this.verifiting = true;
      this.$store
        .dispatch("onVerify", {
          phone: this.login_form.mobile_number,
          code: this.verify_code,
        })
        .then((res) => {
          if (!res.data.errors) {
            this.verifiting = false;
            this.dialogVisible = false;
            this.isWatting = false;
            this.loadApp();
          } else {
            this.$message({
              message:
                "Authentication code is incorrect, or unexpected error occurred.",
              type: "warning",
            });
          }

          this.verifiting = false;
        })
        .catch((error) => {
          this.verifiting = false;
          console.log(error);
        });
    },
    loadApp() {
      this.$store
        .dispatch("appLoad")
        .then((res) => {
          //console.log(res)
        })
        .catch((err) => {
          //console.log(err)
        });
    },
  },
};
</script>

<style>
.banner-login {
  padding: 1rem 3rem;
}

.banner-login img {
  width: 100%;
  display: block;
  object-fit: cover;
}
.bannerVerify img {
  width: 100%;
  display: block;
  object-fit: cover;
  animation: roteKey 10s infinite linear;
}
.login-screen {
  background-image: url("../assets/images/bg.jpg");
  background-position: center;
}
.title-login {
  font-family: "Acme", sans-serif;
  text-shadow: 0px 2px 3px #555;
  color: #951620;
  font-size: 100px;
  margin: 0;
}

.body-section {
  margin-bottom: 2rem;
}
.form-login {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.form-login .el-input__inner {
  text-align: center;
  font-weight: bold;
}
.form-login label.el-checkbox.checkbox-login {
  display: inline-flex;
  align-items: baseline;
}
.form-login .el-checkbox__inner {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  background-color: #fff;
  z-index: 1;
  transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
    background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
}
.form-login .el-checkbox__label {
  display: inline-block;
  padding-left: 10px;
  line-height: 19px;
  font-size: 34px;
  color: #ffffff;
}
.form-login .el-checkbox__inner::after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 7px;
  position: absolute;
  top: 4px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform 0.15s ease-in 0.05s;
  transform-origin: center;
}
.btn-login {
  background-color: #1e6942 !important;
  border: 2px solid #22c99b !important;
  border-radius: 15px !important;
  color: #063b20 !important;
  box-shadow: 0 0 2px #f9fbfa, 0 0 2px rgb(0 0 0), inset 0 0 2px rgb(0 0 0) !important;
  width: 150px;
  height: 50px;
}

.btn-login:focus {
  outline: none;
}

.dialog-footer-login {
  display: flex;
  flex-direction: column;
}

.verify-dialog {
  border-radius: 10px !important;
  border: 2px solid #22c99b;
  background-color: #1e6942 !important;
  width: 96%;
  max-width: 350px;
}

.verify-dialog span {
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.verify-dialog .el-input {
  margin-top: 10px;
}
.verify-dialog .el-input__inner {
  letter-spacing: 12px;
  font-size: 20px;
  text-align: center;
}
@keyframes roteKey {
  0% {
    transform: rotate(0);
  }
  10% {
    transform: rotate(36deg);
  }
  20% {
    transform: rotate(72deg);
  }
  30% {
    transform: rotate(108deg);
  }
  40% {
    transform: rotate(144deg);
  }

  50% {
    transform: rotate(180deg);
  }
  60% {
    transform: rotate(216deg);
  }

  70% {
    transform: rotate(252deg);
  }

  80% {
    transform: rotate(288deg);
  }

  90% {
    transform: rotate(324deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
