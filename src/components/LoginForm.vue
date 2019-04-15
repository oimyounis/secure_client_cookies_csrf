<template>
    <div class="login-form">
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="usernameInput">Username</label>
                <input v-model="username" type="text" class="form-control" id="usernameInput" aria-describedby="usernameHelp" placeholder="Enter username">
            </div>
            <div class="form-group">
                <label for="passwordInput">Password</label>
                <input v-model="password" type="password" class="form-control" id="passwordInput" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
            <div class="error" v-if="$store.state.auth.loginErrorMsg">{{$store.state.auth.loginErrorMsg}}</div>
        </form>
    </div>
</template>

<script>
    import {login} from "../services/auth.service";

    export default {
    name: "LoginForm",
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login() {
        login(this.username, this.password)
          .then(() => {
            this.$router.replace('/');
          })
          .catch(error => {
            this.$store.commit('auth/logout', error.response.data.message);
          });
      }
    },
  }
</script>

<style scoped>
    form {
        display: inline-block;
        max-width: 400px;
        width: 100%;
        text-align: left;
    }
    .login-form {
        text-align: center;
    }
    .error {
        max-width: 400px;
        width: 100%;
        background: #ffb4ac;
        border: 1px solid #f00;
        border-radius: 5px;
        padding: 8px;
        margin-top: 20px;
        text-align: center;
    }
</style>