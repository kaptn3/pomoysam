<template>
  <div class="container">
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
        <b-select
          v-model="opType"
          placeholder="Тип операции"
          style="max-width: 222px;"
        >
          <option :value="1">
            Расход
          </option>
          <option :value="0">
            Приход
          </option>
        </b-select>
        <b-select
          v-model="chem"
          placeholder="Вид химии"
          style="max-width: 222px;"
        >
          <option
            v-for="option in chemSort"
            :key="option.id"
            :value="option.id"
          >
            {{ option.name }}
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
  </div>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';
  import getList from '../components/mixins/getList';

  export default {
    name: 'AdmCashOuts',
    mixins: [table, getList],
    data() {
      return {
        coinsByObject: [],
        opType: null,
        chem: null,
        head: [
          {
            field: 'operator',
            label: 'Оператор'
          },
          {
            field: 'car_wash',
            label: 'Объект'
          },
          {
            field: 'date_time',
            label: 'Дата'
          },
          {
            field: 'chem',
            label: 'Вид химии'
          },
          {
            field: 'operation_type',
            label: 'Тип операции'
          },
          {
            field: 'quantity',
            label: 'Количество'
          },
        ]
      };
    },
    mounted() {
      this.getCarWashList();
      this.getChemSort();
      this.getData();
    },
    methods: {
      resetFilters() {
        this.resetArray(['objectId', 'opType', 'chem']);
      },
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admChem/`;
        const config = {
          params: {
            date_from: this.dateFromString,
            date_to: this.dateToString,
            page: this.page,
            object_id: this.objectId,
            op_type: this.opType,
            chem_sort: this.chem
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
