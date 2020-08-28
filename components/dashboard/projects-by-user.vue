<template>
  <v-card class="pb-4">
    <v-card-title>
      Ilość projektów na osobę
    </v-card-title>
    <v-card-subtitle>
      {{ profession }}
    </v-card-subtitle>
    <w-cartesian :dataset="data" :height="300" :bound="[0]" responsive>
      <w-bar :color="color" :width="45" datakey="value" show-label />
      <w-x-axis datakey="text" />
      <w-y-axis />
    </w-cartesian>
  </v-card>
</template>

<script>
import { WCartesian, WBar, WXAxis, WYAxis } from "vue-wcharts";

export default {
  name: "ProjectsByUser",
  components: {
    WCartesian,
    WBar,
    WXAxis,
    WYAxis
  },
  props: {
    profession: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    color: {
      type: String,
      required: false,
      default: "blue"
    }
  }
};
</script>
