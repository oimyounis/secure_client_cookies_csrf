<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <div class="container">
      <div style="margin-bottom: 20px;">
        <button class="btn btn-primary" @click="syncUsers">
            <i :class="{'fa fa-refresh': true, 'fa-spin': usersSyncing}"></i>
        </button>
      </div>
      <form action="">
        <input type="text" name="username">
        <span class="error" v-if="$store.state.organizations.errors.username">{{$store.state.organizations.errors.username[0]}}</span>
      </form>

      <table class="table table-dark">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in $store.state.users.items" :key="index">
            <th scope="row">{{index + 1}}</th>
            <td>{{user.name}}</td>
            <td>{{user.age}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {BASEURL} from "../config";

  export default {
  name: 'home',
  data () {
    return {
      base: BASEURL
    }
  },
  methods: {
    syncUsers() {
      this.$store.dispatch('users/getAll');
    },
    loadOrgs() {
      this.$store.dispatch('organizations/getAllOrgs');
    },
    selectOrg(id) {
      this.$store.dispatch('organizations/getOrgById', id);
    }
  },
  computed: {
    usersSyncing() {
      return this.$store.state.users.syncing;
    }
  }
}
</script>
