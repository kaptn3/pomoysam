<template>
  <div class="container">
    <section>
      <b-field
        class="group"
        grouped
      >
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
      <b-field label="ФИО">
        <b-input v-model="search" />
      </b-field>
      <b-table
        :data="body"
        :columns="head"
        :loading="loading"
        :hoverable="true"
        :mobile-cards="true"
        :row-class="(row, index) => (index + 1) % 30 === 0 && 'is-info'"
        @click="openModal"
      >
        <template slot="empty">
          <section class="content has-text-grey has-text-centered">
            <p>Данные не найдены</p>
          </section>
        </template>
      </b-table>
    </section>
    <b-modal
      :active.sync="isModalActive"
      :width="640"
      scroll="keep"
    >
      <edit-tech-form
        :id="id"
        :old-name="name"
        user-type="admEditOperators"
      />
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';
  import getList from '../components/mixins/getList';
  import EditTechForm from '../components/EditTechForm.vue';

  export default {
    name: 'EditOperators',
    components: { EditTechForm },
    mixins: [table, getList],
    data() {
      return {
        coinsByObject: [],
        id: null,
        name: null,
        isModalActive: false,
        search: '',
        head: [
          {
            field: 'name',
            label: 'ФИО'
          },
          {
            field: 'car_wash.car_wash_addr',
            label: 'Объект'
          }
        ]
      };
    },
    computed: {
      body() {
        if (this.search !== '') {
          const body = [];
          for (let i = 0; i < this.data.length; i++) {
            const isSearch = ((this.data[i].name).toLowerCase()).includes(this.search.toLowerCase());
            if (isSearch) {
              body.push(this.data[i]);
            }
          }
          return body;
        }
        return this.data;
      }
    },
    watch: {
      isModalActive() {
        if (!this.isModalActive) {
          this.id = null;
          this.name = null;
          this.getData();
        }
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
      getData() {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admEditOperators/`;
        const config = {
          params: {
            object_id: this.objectId
          },
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        };
        axios
          .get(url, config)
          .then((res) => {
            this.data = res.data;
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      openModal(row) {
        this.isModalActive = true;
        this.name = row.name;
        this.id = row.id;
      }
    }
  };
</script>
