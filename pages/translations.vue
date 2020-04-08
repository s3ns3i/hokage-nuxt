<template>
  <v-container>
    <v-row>
      <v-col class="pa-0">
        <translations-menu />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="3" lg="2">
        <translations-drawer />
      </v-col>
      <v-col md="9" lg="10">
        <nuxt-child :key="$route.params.id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TranslationsDrawer from "@/components/translations-drawer.vue";
import TranslationsMenu from "@/components/translations-menu.vue";

export default {
  name: "Translations",
  components: { TranslationsDrawer, TranslationsMenu }
};
</script>

<style>
</style>