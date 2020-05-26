<template>
  <v-card class="pb-4">
    <v-card-title>
      Ilość skończonych rozdziałów w ciągu miesiąca
    </v-card-title>
    <v-toolbar flat>
      <v-btn fab icon @click="prev">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn class="mx-4" color="primary" text @click="setToday">
        Dzisiaj
      </v-btn>
      <v-btn fab icon @click="next">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-toolbar-title class="ml-2">{{ title }}</v-toolbar-title>
    </v-toolbar>
    <div class="px-4">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        interval-count="1"
        interval-height="80"
        short-months
        short-weekdays
        @change="updateRange"
      >
        <template v-slot:day="{ day }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <div
                :class="[
                  'text-center',
                  'ma-2',
                  { 'red--text font-weight-bold': chaptersNo(day) === 0 }
                ]"
                v-on="chaptersNo(day) ? on : null"
              >
                {{ chaptersNo(day) }}
              </div>
            </template>
            <div v-for="(name, index) in tasks[day]" :key="index">
              <span>{{ name }}</span>
            </div>
          </v-tooltip>
        </template>
      </v-calendar>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      focus: "",
      type: "week",
      start: null,
      end: null,
      typeToLabel: {
        month: "Miesiąc",
        week: "Tydzień"
      },
      tasks: {}
    };
  },
  computed: {
    title() {
      if (!this.start) {
        return "";
      }
      const startMonth = this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      })(this.start);

      return `${startMonth} ${this.start.year}`;
    }
  },
  beforeMount() {
    this.$store.getters["task/find"]({
      query: { roleId: null }
    }).data.forEach(task => {
      const date = new Date(task.updatedAt);
      const day = new Intl.DateTimeFormat("pl", { day: "numeric" }).format(
        date
      );
      if (day in this.tasks) {
        this.tasks[day] += 1;
      } else {
        this.tasks[day] = [];
        this.tasks[day].push(`${task.name}: ${task.chapterNo}`);
      }
    });
  },
  methods: {
    chaptersNo(day) {
      if (day in this.tasks) {
        return this.tasks[day].length;
      } else {
        return 0;
      }
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    }
  }
};
</script>

<style></style>
