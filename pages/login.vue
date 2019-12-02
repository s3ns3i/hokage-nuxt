<template>
  <nuxt-link to="/">
    <login />
  </nuxt-link>
</template>

<script>
import Login from "@/layouts/login.vue";

export default {
  name: "Index",
  components: {
    Login
  },
  data() {
    return {};
  }
};
</script>