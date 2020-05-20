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
      <b-select
        v-model="promoId"
        placeholder="Промо-код"
        style="max-width: 222px;"
      >
        <option
          v-for="option in promoList"
          :key="option.id"
          :value="option.id"
        >
          {{ option.code }}
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
    <b-table
      :data="data"
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
  </section>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';

  export default {
    name: 'AdmUsedPromo',
    mixins: [table],
    data() {
      return {
        phoneStr: null,
        promoId: null,
        promoList: [],
        head: [
          {
            label: 'Номер телефона пользователя',
            field: 'user_phone'
          },
          {
            label: 'Дата и время использования',
            field: 'use_date'
          },
          {
            label: 'Промо-код',
            field: 'promo_code'
          }
        ]
      };
    },
    mounted() {
      this.getPromoList();
      this.getData();
    },
    methods: {
      resetFilters() {
        this.resetArray(['phoneStr', 'promoId']);
      },
      getPromoList() {
        const url = `${process.env.VUE_APP_API}promoList/`;
        axios.get(url)
          .then((res) => {
            this.promoList = res.data;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admUsedPromo/`;
        const config = {
          params: {
            date_from: this.dateFromString,
            date_to: this.dateToString,
            page: this.page,
            phone_str: this.phoneStr,
            promo_id: this.promoId,
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
