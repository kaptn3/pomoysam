<template>
  <div class="container">
    <section>
      <b-field
        class="group"
        grouped
      >
        <b-datetimepicker
          v-model="createDateFrom"
          placeholder="Дата от возникновения неисправности"
          icon="calendar-today"
          class="input-field"
          editable
          horizontal-time-picker
        />
        <b-datetimepicker
          v-model="createDateTo"
          placeholder="Дата до возникновения неисправности"
          icon="calendar-today"
          class="input-field"
          editable
          horizontal-time-picker
        />
        <b-datetimepicker
          v-model="receivedDateFrom"
          placeholder="Дата от приема техником"
          icon="calendar-today"
          class="input-field"
          editable
          horizontal-time-picker
        />
        <b-datetimepicker
          v-model="receivedDateTo"
          placeholder="Дата до приема техником"
          icon="calendar-today"
          class="input-field"
          editable
          horizontal-time-picker
        />
        <b-datetimepicker
          v-model="correctedDateFrom"
          placeholder="Дата от устранения неисправности"
          icon="calendar-today"
          class="input-field"
          editable
          horizontal-time-picker
        />
        <b-datetimepicker
          v-model="correctedDateTo"
          placeholder="Дата до устранения неисправности"
          icon="calendar-today"
          class="input-field"
          editable
          horizontal-time-picker
        />
        <b-select
          v-model="brokenStatus"
          placeholder="Статус неисправности"
          style="max-width: 222px;"
          class="input-field"
        >
          <option
            v-for="item in statuses"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </b-select>
        <b-select
          v-model="tehId"
          placeholder="Техник, которому назначена неисправность"
          style="max-width: 222px;"
          class="input-field"
        >
          <option
            v-for="item in techs"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </b-select>
        <b-select
          v-model="tehReceivedId"
          placeholder="Техник, принявший неисправность в работу"
          style="max-width: 222px;"
        >
          <option
            v-for="item in techs"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </b-select>
        <b-select
          v-model="tehChangedId"
          placeholder="Техник, изменивший статус неисправности"
          style="max-width: 222px;"
        >
          <option
            v-for="item in techs"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </b-select>
        <b-select
          v-model="object"
          placeholder="Объект"
          style="max-width: 222px;"
        >
          <option
            v-for="item in carWashList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.car_wash_addr }}
          </option>
        </b-select>
        <div class="buttons">
          <b-button
            type="is-info"
            @click="getData(false)"
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
      <b-button
        type="is-info"
        @click="isModalActive = true"
      >
        Добавить задачу
      </b-button>
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
        :row-class="(row, index) => (index + 1) % 30 === 0 && 'is-info'"
      >
        <template slot-scope="props">
          <b-table-column
            v-for="(value, name) in props.row"
            :key="name"
            :style="name === 'broken_stat_id' ? 'display: none' : ''"
            :field="name"
          >
            {{ value }}
          </b-table-column>
          <b-table-column
            field="actions"
            label=" "
          >
            <b-button
              type="is-danger"
              @click="fixTask(props.row.broken_stat_id)"
            >
              Закрыть
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
    <b-modal
      :active.sync="isModalActive"
      :width="640"
      scroll="keep"
    >
      <add-task />
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';
  import getList from '../components/mixins/getList';
  import AddTask from '../components/AddTask';

  export default {
    name: 'AdmBrokenStat',
    components: { AddTask },
    mixins: [table, getList],
    data() {
      return {
        disabledArrow: 'left',
        isModalActive: false,
        object: null,
        createDateFrom: null,
        createDateTo: null,
        receivedDateFrom: null,
        receivedDateTo: null,
        correctedDateFrom: null,
        correctedDateTo: null,
        coinsByObject: [],
        brokenStatus: null,
        tehId: null,
        tehReceivedId: null,
        tehChangedId: null,
        head: [
          {
            field: 'first',
            label: 'Время возникновения / Приема техником / Устранения неисправности',
            sticky: true
          },
          {
            field: 'second',
            label: 'Неисправность / № поста / Комментарий (задача)'
          },
          {
            field: 'third',
            label: 'Мойка / ФИО оператора'
          },
          {
            field: 'four',
            label: 'Техник(кому назначена / принявший / изменивший статус) неисправности'
          },
          {
            field: 'five',
            label: 'Статус неисправности'
          },
          {
            field: 'six',
            label: 'Способ устранения / комментарий техника / закрыто администратором'
          },
          {
            field: 'actions',
            label: ' '
          }
        ],
        statuses: [
          {
            label: 'Устранена',
            value: 'closed'
          },
          {
            label: 'Не устранена',
            value: 'opened'
          },
          {
            label: 'Не может быть устранена',
            value: 'broken_cant_fixed'
          },
          {
            label: 'Отложена',
            value: 'broken_postponed'
          },
          {
            label: 'Закрыто администратором',
            value: 'corrected_by_admin'
          }
        ]
      };
    },
    computed: {
      body() {
        const body = [];
        const linkToData = this.data;

        for (let i = 0; i < this.data.length; i++) {
          for (const key in linkToData[i]) {
            if (linkToData[i][key] === false || linkToData[i][key] === true) {
              linkToData[i][key] = (this.data[i][key] !== true && this.data[i][key] !== '✔') ? '-' : '✔';
            } else if (linkToData[i][key] === null || linkToData[i][key] === '') {
              linkToData[i][key] = '-';
            }
          }

          const fields = {};
          const object = linkToData[i];

          fields.first = `${object.create_time} / ${object.received_by_teh_time} / ${object.corrected_by_teh_time}`;
          fields.second = `${object.broken} / ${object.post_num} / ${object.description}`;
          fields.third = `${object.car_wash} / ${object.operator}`;
          fields.four = `${object.teh} / ${object.teh_received} / ${object.teh_changed}`;
          fields.five = object.broken_status;
          fields.six = `${object.fix_method} / ${object.fix_comment} / ${object.corrected_by_admin}`;
          fields.broken_stat_id = object.broken_stat_id;
          body.push(fields);
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
      this.getTechs();
      this.getCarWashList();
    },
    methods: {
      resetFilters() {
        this.resetArray([
          'brokenStatus',
          'object',
          'tehId',
          'tehReceivedId',
          'tehChangedId',
          'createDateTo',
          'createDateFrom',
          'receivedDateFrom',
          'receivedDateTo',
          'correctedDateFrom',
          'correctedDateTo'
        ]);
      },
      fixTask(id) {
        const data = new FormData();
        data.set('broken_id', id);
        axios.post(`${process.env.VUE_APP_API}fixBrokenByAdmin/`, data, this.$store.getters.config)
          .then(() => {
            this.getData();
          });
      },
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admBrokenStat/`;
        const config = {
          params: {
            create_date_from: this.convertTime(this.createDateFrom),
            create_date_to: this.convertTime(this.createDateTo),
            received_date_from: this.convertTime(this.receivedDateFrom),
            received_date_to: this.convertTime(this.receivedDateTo),
            corrected_date_from: this.convertTime(this.correctedDateFrom),
            corrected_date_to: this.convertTime(this.correctedDateTo),
            page: this.page,
            broken_status: this.brokenStatus,
            teh_id: this.tehId,
            teh_received_id: this.tehReceivedId,
            teh_changed_id: this.tehChangedId,
            object_id: this.object
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
