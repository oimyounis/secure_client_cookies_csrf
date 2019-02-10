<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png">
    <LoginForm/>
  </div>
</template>

<script>
// @ is an alias to /src
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'login',
  components: {
      LoginForm
  }
}
</script>
