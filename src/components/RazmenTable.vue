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
    <h2
      class="title set-prices"
      aria-controls="contentIdForA11y2"
      @click="isOpenCollapse = !isOpenCollapse"
    >
      Установка цен
      <b-icon :icon="isOpenCollapse ? 'menu-down' : 'menu-right'"/>
    </h2>
    <b-collapse
      aria-id="contentIdForA11y2"
      class="panel"
      animation="slide"
      :open.sync="isOpenCollapse"
    >
      <b-table
        :data="prices"
        :loading="loading"
        :hoverable="true"
        :mobile-cards="true"
      >
        <template slot-scope="props">
          <b-table-column
            field="address"
            label="Разменный аппарат"
          >
            {{ props.row.car_wash.car_wash_addr }}
          </b-table-column>
          <b-table-column
            field="price"
            label="Текущая цена"
            class="column-with-icon"
          >
            {{ props.row.price }}
            <b-button
              class="users-settings"
              @click="changePrice(props.row.id, props.row.price)"
            >
              <b-icon
                icon="settings"
                size="is-small"
              />
            </b-button>
          </b-table-column>
        </template>
      </b-table>
    </b-collapse>
    <h2
      class="title"
    >
      Общая статистика
    </h2>
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
      :row-class="(row, index) => (index + 1) % 30 === 0 && 'is-info'"
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
      <change-price
        :id="idPrice"
        :old-price="oldPrice"
      />
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import Card from './Card';
  import ChangePrice from './ChangePrice';
  import table from './mixins/table';
  import getList from './mixins/getList';

  export default {
    name: 'RazmenTable',
    components: { Card, ChangePrice },
    mixins: [table, getList],
    data() {
      return {
        payByObject: [],
        prices: [],
        isModalActive: false,
        oldPrice: null,
        idPrice: null,
        isOpenCollapse: false,
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
    watch: {
      isModalActive() {
        if (!this.isModalActive) {
          this.idPrice = null;
          this.oldPrice = null;
          this.getRazmenPrice();
        }
      }
    },
    mounted() {
      this.getCarWashList();
      this.getRazmenPrice();
      this.getData();
    },
    methods: {
      resetFilters() {
        this.resetArray(['objectId']);
      },
      getRazmenPrice() {
        const url = `${process.env.VUE_APP_API}admRazmenPrice/`;
        axios.get(url, this.$store.getters.config)
          .then((res) => {
            this.prices = res.data;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      changePrice(id, price) {
        console.log(id, price);
        this.idPrice = id;
        this.oldPrice = price;
        this.isModalActive = true;
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
.set-prices {
 cursor: pointer;
}

.column-with-icon {
  display: flex;
  justify-content: space-between;
}
</style>
