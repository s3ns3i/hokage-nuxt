<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <div>
        <p>Nie udało się połączyć z serwerem :(</p>
        <br />
        <p>Odśwież stronę a jeśli to nie pomoże, skontaktuj się z s3ns3iem.</p>
      </div>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "ErrorLayout",
  layout: "login"
};
</script>
