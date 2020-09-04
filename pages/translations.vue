<template>
  <v-container>
    <v-row>
      <v-col class="pa-0">
        <translations-menu />
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12" md="3" lg="3" xl="2">
        <translations-drawer :compact="$vuetify.breakpoint.smAndDown" />
      </v-col>
      <v-col sm="12" md="9" lg="9" xl="10">
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

<style></style>
