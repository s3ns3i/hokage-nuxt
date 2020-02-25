<template>
  <div>main page</div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      users: []
    };
  },
  mounted() {
    this.$store
      .dispatch("users/find")
      .then(result => (this.users = result))
      .catch(error => console.error(error));
  },
  methods: {
    async onLogout() {
      try {
        await this.$store.dispatch("auth/logout");
        this.$router.push("/login");
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>