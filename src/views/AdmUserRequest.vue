<template>
  <div class="container">
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
        <b-select
          v-model="reviewed"
          placeholder=""
          style="max-width: 222px;"
        >
          <option value=""/>
          <option value="1">
            Обработанные
          </option>
          <option value="0">
            Необработанные
          </option>
        </b-select>
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
        :hoverable="true"
        :mobile-cards="true"
      >
        <template slot-scope="props">
          <b-table-column
            v-for="(value, name) in props.row"
            :key="name"
            :style="name === 'id' ? 'display: none' : ''"
            :field="name"
          >
            {{ value }}
          </b-table-column>
          <b-table-column
            field="actions"
            label=" "
          >
            <b-button
              v-if="props.row.reviewed === '-'"
              @click="markReviewed(props.row.id)"
            >
              ✔
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
    </section>
  </div>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';
  import getList from '../components/mixins/getList';

  export default {
    name: 'AdmUserRequest',
    mixins: [table, getList],
    data() {
      return {
        coinsByObject: [],
        reviewed: null,
        head: [
          {
            field: 'object',
            label: 'Объект'
          },
          {
            field: 'date_time',
            label: 'Дата'
          },
          {
            field: 'user_name',
            label: 'Имя пользователя'
          },
          {
            field: 'user_phone',
            label: 'Номер телефона пользователя'
          },
          {
            field: 'request_text',
            label: 'Текст обращения'
          },
          {
            field: 'reviewed',
            label: 'Обработано'
          },
          {
            field: 'actions',
            label: ' '
          }
        ]
      };
    },
    computed: {
      body() {
        const body = this.data;

        for (let i = 0; i < this.data.length; i++) {
          body[i].reviewed = (this.data[i].reviewed !== true && this.data[i].reviewed !== '✔') ? '-' : '✔';
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
      markReviewed(row) {
        const body = new FormData();
        body.set('request_id', row);

        const url = `${process.env.VUE_APP_API}mark-req-reviewed/`;
        axios.post(url, body, this.$store.getters.config)
          .then(() => {
            this.getData();
          })
          .catch(() => {
            this.getData();
          });
      },
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admUserRequest/`;
        const config = {
          params: {
            date_from: this.dateFromString,
            date_to: this.dateToString,
            page: this.page,
            object_id: this.objectId,
            reviewed: this.reviewed
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
