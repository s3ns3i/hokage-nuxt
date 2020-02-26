<template>
  <div>main page</div>
</template>

<script>
export default {
  name: "Index",
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