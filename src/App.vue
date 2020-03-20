<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-btn @click.stop="dialog = true" text>
        <v-icon>mdi-chart-bar</v-icon>
      </v-btn>

      <v-spacer class="text-right">{{good + boo}} reactions.</v-spacer>

      <v-btn @click="reset()" text>
        <span class="mr-2">Reset</span>
        <v-icon>mdi-lock-reset</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <div class="text-center">
        <h1>How do you feel?</h1>
      </div>

      <MoodChart :good="good" :boo="boo" />

      <div class="text-center">
        <v-btn class="mx-2" fab dark large color="primary" @click="addGood()">
          <v-icon dark>mdi-thumb-up</v-icon>
        </v-btn>

        <v-btn class="mx-2" fab dark large color="pink" @click="addBoo()">
          <v-icon dark>mdi-thumb-down</v-icon>
        </v-btn>
      </div>
    </v-content>

    <v-dialog v-model="dialog" max-width="900">
      <v-card>
        <v-card-title class="headline">Mood statistics.</v-card-title>
        <v-card-text>
          <TimeChart :goods="goods" :boos="boos" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import MoodChart from "./components/MoodChart";
import TimeChart from "./components/TimeChart";
import { db } from "./plugins/firebase";
// import func from "../vue-temp/vue-editor-bridge";

const GOOD_ITEMS = "counter/good/items";
const BOO_ITEMS = "counter/boo/items";
const BATCH_DELETE_SIZE = 1000;

export default {
  name: "App",

  components: {
    MoodChart,
    TimeChart
  },

  data: () => ({
    goods: [],
    boos: [],
    dialog: false
  }),
  computed: {
    good: function() {
      let result = 0;
      for (let i = 0; i < this.goods.length; i++) {
        result++;
      }
      return result;
    },
    boo: function() {
      let result = 0;
      for (let i = 0; i < this.boos.length; i++) {
        result++;
      }
      return result;
    }
  },
  firestore() {
    return {
      goods: db.collection(GOOD_ITEMS),
      boos: db.collection(BOO_ITEMS)
    };
  },
  methods: {
    addGood() {
      db.collection(GOOD_ITEMS).add({ date: new Date() });
    },
    addBoo() {
      db.collection(BOO_ITEMS).add({ date: new Date() });
    },
    reset() {
      deleteCollection(db, GOOD_ITEMS, BATCH_DELETE_SIZE);
      deleteCollection(db, BOO_ITEMS, BATCH_DELETE_SIZE);
    }
  }
};

function deleteCollection(db, collectionPath, batchSize) {
  let collectionRef = db.collection(collectionPath);
  let query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query
    .get()
    .then(snapshot => {
      // When there are no documents left, we are done
      if (snapshot.size == 0) {
        return 0;
      }

      // Delete documents in a batch
      let batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}
</script>
