<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <label for="from_currency">Filter With From Currency</label>
    <select id="from_currency" @change="filterRates">
      <option
        :key="index"
        v-for="(rate, index) in filterRatesValues"
        :value="rate.from_currency"
      >{{rate.from_currency}}</option>
    </select>
    <br />
    <label for="to_currency">Filter With To Currency</label>
    <select id="to_currency" @change="filterRates">
      <option
        :key="index"
        v-for="(rate, index) in filterRatesValues"
        :value="rate.to_currency"
      >{{rate.to_currency}}</option>
    </select>
    <div>
      <b-button @click="clearInputs">Add new Exchange Rate</b-button>
      <br />
      <br />
      <b-modal ref="modal" id="modal" title="Add new Exchange Rate">
        <b-row>
          <b-col sm="8">
            <label for="from_currency">From Currency</label>
            <input id="from_currency" v-model="from_currency" />
            <label for="to_currency">To Currency</label>
            <input id="to_currency" v-model="to_currency" />
            <label for="rate_value">Rate Value</label>
            <input id="rate_value" v-model="rate_value" />
            <button @click="addExchangeRate">Add</button>
          </b-col>
        </b-row>
      </b-modal>
    </div>
    <b-row :key="index" v-for="(rate, index) in filteredExchangeRates">
      <b-col>
        <label for="from_currency">From Currency</label>
        <input id="from_currency" v-model="rate.from_currency" />
        <label for="to_currency">To Currency</label>
        <input id="to_currency" v-model="rate.to_currency" />
        <label for="rate_value">Rate Value</label>
        <input id="rate_value" v-model="rate.rate_value" />
        <button @click="editExchangeRate(rate)">Edit</button>
        <button @click="deleteExchangeRate(rate.id)">Delete</button>
        <input :value="rate.id" type="checkbox" id="scales" name="scales" @change="catchId(rate)" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      rateIds: [],
      firstRate: {},
      rate_value: "",
      to_currency: "",
      from_currency: "",
      exchangeRates: [],
      filterRatesValues: [],
      filteredExchangeRates: []
    };
  },
  mounted() {
    this.getExchangeRates();
  },
  methods: {
    catchId: function(rate) {
      let id = rate.id;
      this.rateIds.push(id);
      /* eslint-disable */
      console.log("Type of ", typeof this.rateIds, this.rateIds);
    },
    filterRates: function(event) {
      let to_currency = document.getElementById("to_currency").value;
      let from_currency = document.getElementById("from_currency").value;
      this.filterExchangeRates(from_currency, to_currency);

      // let rates = [];
      // let id = event.target.id;
      // if (id == "from_currency") {
      // this.filterExchangeRates();
      // this.exchangeRates.forEach(rate => {
      // if (rate.from_currency == event.target.value) {
      // rates.push(rate);
      // }
      // });
      // } else {
      // this.exchangeRates.forEach(rate => {
      // if (rate.to_currency == event.target.value) {
      // rates.push(rate);
      // }
      // });
      // }
      // this.exchangeRates = rates;
    },
    filterExchangeRates(from_currency, to_currency) {
      let exchangeRates = [];
      this.exchangeRates.forEach(rate => {
        if (
          rate.to_currency == to_currency &&
          rate.from_currency == from_currency
        ) {
          exchangeRates.push(rate);
        }
        this.filteredExchangeRates = exchangeRates;
      });
    },
    clearInputs: function() {
      this.from_currency = this.to_currency = this.rate_value = "";
      this.$refs["modal"].show();
    },
    async getExchangeRates() {
      await this.$http.get("/packages/exchange-rate/").then(response => {
        this.firstRate = response.data.results[0];
        this.exchangeRates = response.data.results;
        this.filterRatesValues = response.data.results;
        this.filteredExchangeRates = response.data.results;
      });
      this.filterExchangeRates(
        this.firstRate.from_currency,
        this.firstRate.to_currency
      );
    },
    editExchangeRate: function(rate) {
      let id = rate.id;
      this.$http
        .put(`/packages/exchange-rate/${id}/`, {
          from_currency: rate.from_currency,
          to_currency: rate.to_currency,
          rate_value: rate.rate_value
        })
        .then(response => {
          let newRate = response.data;
          let rates = [];
          this.exchangeRates.forEach(rate => {
            if (rate.id == id) {
              rate.from_currency = newRate.from_currency;
              rate.to_currency = newRate.to_currency;
              rate.rate_value = newRate.rate_value;
            }
            rates.push(rate);
          });
          this.exchangeRates = rates;
        });
    },
    addExchangeRate: function() {
      this.$http
        .post(`/packages/exchange-rate/`, {
          from_currency: this.from_currency,
          to_currency: this.to_currency,
          rate_value: this.rate_value
        })
        .then(response => {
          this.filteredExchangeRates.push(response.data);
          this.$refs["modal"].hide();
        });
    },
    deleteExchangeRate: function(id) {
      this.$http.delete(`/packages/exchange-rate/${id}/`);
      let rates = [];
      this.filteredExchangeRates.forEach(rate => {
        if (rate.id == id) {
          this.filteredExchangeRates.splice(1, 0, rate);
        } else {
          rates.push(rate);
        }
      });
      this.filteredExchangeRates = rates;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

input,
button,
select {
  margin: 5px;
}

input[type="checkbox"] {
  margin: 3px;
}
</style>