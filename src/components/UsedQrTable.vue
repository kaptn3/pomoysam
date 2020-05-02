<template>
  <section>
    <b-field
      class="group"
      grouped
    >
      <b-datepicker
        v-model="dateFrom"
        placeholder="Дата от"
        icon="calendar-today"
        editable
      />
      <b-datepicker
        v-model="dateTo"
        placeholder="Дата до"
        icon="calendar-today"
        editable
      />
      <b-input
        v-model="phoneStr"
        maxlength="11"
        placeholder="Телефон"
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
          @click="applyFilters"
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
        v-for="(item, index) in coinsByObject"
        :key="index + 'coins-by-object'"
        class="column is-3"
      >
        <card
          :object="item"
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

  export default {
    name: 'UsedQrTable',
    components: { Card },
    data() {
      return {
        coinsByObject: [],
        data: [],
        dateFrom: null,
        dateTo: null,
        dateFromString: null,
        dateToString: null,
        loading: true,
        phoneStr: null,
        carWashList: [],
        page: 0,
        cnt: 0,
        objectId: null,
        head: [
          {
            field: 'object',
            label: 'Объект'
          },
          {
            field: 'user_phone',
            label: 'Номер телефона'
          },
          {
            field: 'coins4m',
            label: 'Жетонов на 4 минуты'
          },
          {
            field: 'coins2m',
            label: 'Жетонов на 2 минуты'
          },
          {
            field: 'use_date',
            label: 'Дата использования'
          },
          {
            field: 'use_time',
            label: 'Время использования'
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
      applyFilters() {
        this.page = 0;
        this.dateFromString = this.dateFrom ? this.dateFrom.toLocaleDateString() : null;
        this.dateToString = this.dateTo ? this.dateTo.toLocaleDateString() : null;
        this.getData();
      },
      resetFilters() {
        this.page = 0;
        this.dateFrom = null;
        this.dateTo = null;
        this.dateFromString = null;
        this.dateToString = null;
        this.phoneStr = null;
        this.objectId = null;
        this.getData();
      },
      seeMore() {
        this.page += 1;
        this.getData(true);
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
        const url = `${process.env.VUE_APP_API}admUsedQR/`;
        const config = {
          params: {
            date_from: this.dateFromString,
            date_to: this.dateToString,
            page: this.page,
            phone_str: this.phoneStr,
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
            this.coinsByObject = res.data.coins_by_object;
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
