<template>
  <section>
    <b-field
      class="group"
      grouped
    >
      <b-datetimepicker
        v-model="dateFrom"
        placeholder="Дата от"
        icon="calendar-today"
        editable
        horizontal-time-picker
      />
      <b-datetimepicker
        v-model="dateTo"
        placeholder="Дата до"
        icon="calendar-today"
        editable
        horizontal-time-picker
      />
      <b-select
        v-model="objectId"
        placeholder="Объект"
        style="max-width: 222px;"
      >
        <option
          v-for="option in carWashList"
          :key="option.id"
          :value="option.id"
        >
          {{ option.car_wash_addr }}
        </option>
      </b-select>
      <div class="buttons">
        <b-button
          type="is-info"
          @click="applyFilters(true)"
        >
          Применить
        </b-button>
        <b-button
          type="is-info"
          outlined
          @click="resetFilters"
        >
          Сбросить
        </b-button>
      </div>
    </b-field>
    <div class="columns justify-between">
      <p class="column total-users">
        Всего записей: <strong>{{ cnt }}</strong>
      </p>
    </div>
    <div class="columns is-multiline">
      <div
        v-for="(item, index) in payByObject"
        :key="index + 'coins-by-object'"
        class="column is-3"
      >
        <card
          :object="item"
          :title="item.car_wash__car_wash_addr"
        />
      </div>
    </div>
    <b-table
      :data="body"
      :columns="head"
      :loading="loading"
      :hoverable="true"
      :mobile-cards="true"
    >
      <template slot="empty">
        <section class="content has-text-grey has-text-centered">
          <p>Данные не найдены</p>
        </section>
      </template>
    </b-table>
    <b-button
      class="see-more is-fullwidth"
      size="is-medium"
      type="is-info"
      @click="seeMore"
    >
      Показать ещё
    </b-button>
  </section>
</template>

<script>
  import axios from 'axios';
  import Card from './Card';
  import table from './mixins/table';

  export default {
    name: 'RazmenTable',
    components: { Card },
    mixins: [table],
    data() {
      return {
        payByObject: [],
        carWashList: [],
        objectId: null,
        head: [
          {
            field: 'object',
            label: 'Объект'
          },
          {
            field: 'pay_date',
            label: 'Дата платежа'
          },
          {
            field: 'summ',
            label: 'Сумма чека'
          },
          {
            field: 'coins_cnt',
            label: 'Количество жетонов'
          }
        ]
      };
    },
    computed: {
      body() {
        const body = this.data;

        for (let i = 0; i < this.data.length; i++) {
          const coinsCnt = this.data[i].coins_cnt;
          if (coinsCnt === null) {
            body[i].coins_cnt = 0;
          }
          body[i].total_cnt = body[i].coins_cnt;
        }

        return body;
      }
    },
    mounted() {
      this.getCarWashList();
      this.getData();
    },
    methods: {
      resetFilters() {
        this.resetArray(['objectId']);
      },
      getCarWashList() {
        const url = `${process.env.VUE_APP_API}razmenCarWashList/`;
        axios.get(url)
          .then((res) => {
            this.carWashList = res.data;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admRazmenStatistic/`;
        const config = {
          params: {
            date_from: this.dateFromString,
            date_to: this.dateToString,
            page: this.page,
            object_id: this.objectId
          },
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        };
        axios
          .get(url, config)
          .then((res) => {
            if (more) {
              this.data = this.data.concat(res.data.resp);
            } else {
              this.data = res.data.resp;
            }
            this.cnt = res.data.cnt;
            this.payByObject = res.data.pay_by_object;
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      }
    }
  };
</script>

<style scoped>
  .group {
    align-items: flex-start;
  }

  .see-more {
    margin-top: 20px;
  }

  .total-users {
    font-size: 18px;
    margin-bottom: 20px;
  }
</style>
