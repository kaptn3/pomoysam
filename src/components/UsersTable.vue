<template>
  <section>
    <b-field label="Выберите дату">
      <b-datepicker
        v-model="dateFrom"
        placeholder="Дата от"
        icon="calendar-today"
        editable
      />
    </b-field>
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
  </section>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'UsersTable',
    data() {
      return {
        data: [],
        dateFrom: null,
        dateTo: null,
        loading: true,
        sortField: null,
        sortOrder: null,
        page: 0,
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
      dateFrom() {
        this.getData();
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
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
            date_from: this.dateFrom,
            date_to: this.dateTo,
            sort_field: this.sortField,
            sort_order: this.sortOrder,
            page: this.page
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
  .see-more {
    margin-top: 20px;
  }
</style>
