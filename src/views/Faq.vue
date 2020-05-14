<template>
  <section class="container">
    <b-button
      type="is-info"
      @click="isModalActive = true"
    >
      Добавить
    </b-button>
    <b-table
      :data="data"
      :columns="head"
      :loading="loading"
      :hoverable="true"
      :mobile-cards="true"
      @click="editRow"
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
            type="is-danger"
            @click="deleteFaq(props.row.id)"
          >
            Удалить
          </b-button>
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
      <add-faq :row="currentRow" />
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import AddFaq from '../components/AddFaq';

  export default {
    name: 'Faq',
    components: { AddFaq },
    data() {
      return {
        data: [],
        head: [
          {
            field: 'question',
            label: 'Вопрос'
          },
          {
            field: 'answer',
            label: 'Ответ'
          },
          {
            field: 'actions',
            label: ' '
          }
        ],
        loading: true,
        isModalActive: false,
        currentRow: null,
        isDelete: false
      };
    },
    computed: {
      url() {
        return `${process.env.VUE_APP_API}admFaq/`;
      }
    },
    watch: {
      isModalActive() {
        if (!this.isModalActive) {
          this.getFaq();
          this.currentRow = null;
        }
      }
    },
    mounted() {
      this.getFaq();
    },
    methods: {
      getFaq() {
        this.loading = true;
        axios.get(this.url, this.$store.getters.config)
          .then((res) => {
            this.data = res.data;
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      deleteFaq(row) {
        this.isDelete = true;
        const data = new FormData();
        data.set('id', row);
        axios.delete(this.url, {
          data,
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        })
          .then(() => {
            this.getFaq();
            this.isDelete = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      },
      editRow(row) {
        this.currentRow = row;
        this.isModalActive = true && !this.isDelete;
      }
    },
  };
</script>
