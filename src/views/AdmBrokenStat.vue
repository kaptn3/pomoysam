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
      <div>
        <b-button
          :disabled="disabledArrow === 'left'"
          style="margin-right: 20px;"
          icon-right="arrow-left-thick"
          @click="scrollTable(true)"
        />
        <b-button
          :disabled="disabledArrow === 'right'"
          icon-right="arrow-right-thick"
          @click="scrollTable(false)"
        />
      </div>
      <b-table
        :data="body"
        :columns="head"
        :loading="loading"
        :hoverable="true"
        :mobile-cards="true"
        :row-class="(row, index) => (index + 1) % 30 === 0 && 'is-info'"
        class="broken-stat__table"
        sticky-header
        height="3100px"
      >
        <template slot-scope="props">
          <b-table-column
            v-for="(value, name) in props.row"
            :key="name"
            :style="name === 'broken_stat_id' ? 'display: none' : ''"
            :field="name"
            :sticky="name === 'car_wash'"
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
            field: 'car_wash',
            label: 'Мойка',
            sticky: true
          },
          {
            field: 'operator',
            label: 'Оператор'
          },
          {
            field: 'broken',
            label: 'Неисправность'
          },
          {
            field: 'description',
            label: 'Комментарий оператора/Текст задачи'
          },
          {
            field: 'post_num',
            label: 'Номер поста'
          },
          {
            field: 'fix_method',
            label: 'Способ устранения'
          },
          {
            field: 'fix_comment',
            label: 'Комментарий техника'
          },
          {
            field: 'teh',
            label: 'Техник, которому назначена неисправность'
          },
          {
            field: 'teh_received',
            label: 'Техник, принявший неисправность в работу'
          },
          {
            field: 'teh_changed',
            label: 'Техник, изменивший статус неисправности'
          },
          {
            field: 'corrected_by_admin',
            label: 'Закрыто администратором'
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
        const body = this.data;
        const bodySort = [];

        for (let i = 0; i < this.data.length; i++) {
          for (const key in body[i]) {
            if (body[i][key] === false || body[i][key] === true) {
              body[i][key] = (this.data[i][key] !== true && this.data[i][key] !== '✔') ? '-' : '✔';
            } else if (body[i][key] === null) {
              body[i][key] = '-';
            }
          }
          const fields = {};
          for (let j = 0; j < this.head.length; j++) {
            fields[this.head[j].field] = body[i][this.head[j].field];
          }
          fields.broken_stat_id = body[i].broken_stat_id;
          bodySort.push(fields);
        }

        return bodySort;
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
      const stickyEl = document.querySelector('.has-sticky-header');
      const tableEl = stickyEl.querySelector('table');
      console.log(tableEl.clientWidth, stickyEl);
    },
    methods: {
      scrollTable(isLeft) {
        const stickyEl = document.querySelector('.has-sticky-header');
        if (isLeft) {
          stickyEl.scrollLeft = 0;
          this.disabledArrow = 'left';
        } else {
          const tableEl = stickyEl.querySelector('table');
          stickyEl.scrollLeft = tableEl.clientWidth - stickyEl.clientWidth;
          this.disabledArrow = 'right';
        }
      },
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
