<template>
  <section>
    <b-field label="ФИО">
      <b-input v-model="search" />
    </b-field>
    <b-table
      :data="body"
      :loading="loading"
      :hoverable="true"
      :mobile-cards="true"
      :row-class="(row, index) => (index + 1) % 30 === 0 && 'is-info' || 'tr'"
      @click="openModal"
    >
      <template slot-scope="props">
        <b-table-column
          field="name"
          label="ФИО"
        >
          {{ props.row.name }}
        </b-table-column>
      </template>
      <template slot="empty">
        <section class="content has-text-grey has-text-centered">
          <p>Данные не найдены</p>
        </section>
      </template>
    </b-table>
    <b-modal
      :active.sync="isModalActive"
      :width="640"
      scroll="keep"
    >
      <edit-tech-form
        :id="id"
        :old-name="name"
      />
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';
  import EditTechForm from '../components/EditTechForm.vue';

  export default {
    name: 'EditTechs',
    components: { EditTechForm },
    mixins: [table],
    data() {
      return {
        data: [],
        id: null,
        name: null,
        isModalActive: false,
        search: ''
      };
    },
    computed: {
      body() {
        if (this.search !== '') {
          const body = [];
          for (let i = 0; i < this.data.length; i++) {
            const isSearch = ((this.data[i].name).toLowerCase()).includes(this.search);
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
      this.getData();
    },
    methods: {
      getData() {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admEditTehs/`;
        const config = {
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        };
        axios
          .get(url, config)
          .then((res) => {
            console.log(res);
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
