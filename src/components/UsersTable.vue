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
      <b-input
        v-model="phoneStr"
        maxlength="11"
        placeholder="Телефон"
      />
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
        Всего пользователей: <strong>{{ cnt }}</strong>
      </p>
      <div class="column">
        <b-button
          type="is-info"
          outlined
          @click="isModalActive = true"
        >
          Начислить бесплатные жетоны
        </b-button>
      </div>
    </div>
    <b-table
      :data="body"
      :columns="head"
      :loading="loading"
      :sorting="true"
      :hoverable="true"
      :mobile-cards="true"
      backend-sorting
      @sort="onSort"
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
    <b-modal
      :active.sync="isModalActive"
      :width="640"
      scroll="keep"
    >
      <create-free-qr/>
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import CreateFreeQr from './CreateFreeQr';

  export default {
    name: 'UsersTable',
    components: { CreateFreeQr },
    data() {
      return {
        data: [],
        dateFrom: null,
        dateTo: null,
        dateFromString: null,
        dateToString: null,
        loading: true,
        sortField: null,
        sortOrder: null,
        phoneStr: null,
        isModalActive: false,
        page: 0,
        cnt: 0,
        head: [
          {
            field: 'phone',
            label: 'Номер телефона'
          },
          {
            field: 'register_date',
            label: 'Дата регистрации',
            sortable: true
          },
          {
            field: 'total_cnt',
            label: 'Всего жетонов',
            sortable: true
          },
          {
            field: 'balance',
            label: 'Бонусный баланс'
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
    watch: {
      isModalActive() {
        if (!this.isModalActive) {
          this.getData();
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      applyFilters() {
        this.page = 0;
        this.dateFromString = this.dateFrom ? `${this.dateFrom.toLocaleDateString()},${this.dateFrom.toLocaleTimeString()}` : null;
        this.dateToString = this.dateTo ? `${this.dateTo.toLocaleDateString()},${this.dateTo.toLocaleTimeString()}` : null;
        this.getData();
      },
      resetFilters() {
        this.page = 0;
        this.dateFrom = null;
        this.dateTo = null;
        this.dateFromString = null;
        this.dateToString = null;
        this.sortField = null;
        this.sortOrder = null;
        this.phoneStr = null;
        this.getData();
      },
      onSort(field, order) {
        this.sortField = field;
        this.sortOrder = order;
        this.page = 0;
        this.getData();
      },
      seeMore() {
        this.page += 1;
        this.getData(true);
      },
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admUsers/`;
        const config = {
          params: {
            date_from: this.dateFromString,
            date_to: this.dateToString,
            sort_field: this.sortField,
            sort_order: this.sortOrder,
            page: this.page,
            phone_str: this.phoneStr
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
