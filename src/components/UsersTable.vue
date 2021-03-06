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
      <div class="buttons">
        <b-button
          type="is-info"
          @click="applyFilters(false)"
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
    <b-table
      :data="body"
      :columns="head"
      :loading="loading"
      :sorting="true"
      :hoverable="true"
      :mobile-cards="true"
      :row-class="(row, index) => (index + 1) % 30 === 0 && 'is-info' || 'tr'"
      backend-sorting
      @sort="onSort"
    >
      <template slot-scope="props">
        <b-table-column
          v-for="(value, name) in props.row"
          :key="name"
          :field="name"
          :style="name === 'user_id' ? 'display: none' : null"
          :class="name === 'balance' ? 'column-with-icon' : null"
        >
          {{ value }}
          <b-button
            v-if="name === 'balance'"
            class="users-settings"
            @click="cacheBack(props.row)"
          >
            <b-icon
              icon="settings"
              size="is-small"
            />
          </b-button>
        </b-table-column>
      </template>
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
      <cash-back-balance
        :user-id="userId"
        :old-balance="oldBalance"
      />
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import table from './mixins/table';
  import CashBackBalance from './CashBackBalance';

  export default {
    name: 'UsersTable',
    components: { CashBackBalance },
    mixins: [table],
    data() {
      return {
        sortField: null,
        sortOrder: null,
        phoneStr: null,
        isModalActive: false,
        userId: null,
        oldBalance: null,
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
            label: 'Бонусный баланс',
            sortable: true
          }
        ]
      };
    },
    computed: {
      body() {
        const body = this.data;
        const newBody = [];

        for (let i = 0; i < this.data.length; i++) {
          const coinsCnt = this.data[i].coins_cnt;
          if (coinsCnt === null) {
            body[i].coins_cnt = 0;
          }
          body[i].total_cnt = body[i].coins_cnt;
        }

        for (let k = 0; k < body.length; k++) {
          newBody.push({
            phone: body[k].phone,
            register_date: body[k].register_date,
            total_cnt: body[k].total_cnt,
            balance: body[k].balance,
            user_id: body[k].user_id
          });
        }

        return newBody;
      }
    },
    watch: {
      isModalActive() {
        if (!this.isModalActive) {
          this.userId = null;
          this.oldBalance = null;
          this.getData();
        }
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      resetFilters() {
        this.resetArray(['sortField', 'sortOrder', 'phoneStr']);
      },
      onSort(field, order) {
        this.sortField = field;
        this.sortOrder = order;
        this.page = 0;
        this.getData();
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
      },
      cacheBack(row) {
        this.isModalActive = true;
        this.userId = row.user_id;
        this.oldBalance = row.balance;
      }
    }
  };
</script>

<style>
.users-settings {
  border: none;
  padding: 0;
  height: 100%;
  display: inline-flex;
  background: transparent;
}

.users-settings:hover,
.users-settings:focus {
  color: #b2302a;
}

.column-with-icon {
  display: flex;
  justify-content: space-between;
}
</style>
