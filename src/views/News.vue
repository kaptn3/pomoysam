<template>
  <section class="container">
    <div class="add-news">
      <b-button
        type="is-info add-news__btn"
        @click="isModalActive = true"
      >
        Добавить
      </b-button>
      <p>
        {{ newsText }}
      </p>
    </div>
    <b-table
      :data="data"
      :loading="loading"
      :hoverable="true"
      :mobile-cards="true"
      @click="editRow"
    >
      <template slot-scope="props">
        <b-table-column
          label="Картинка"
          field="image"
        >
          <img
            :src="props.row.image"
            class="image"
          >
        </b-table-column>
        <b-table-column
          label="Сортировка"
          field="sort_field"
        >
          {{ props.row.sort_field }}
        </b-table-column>
        <b-table-column
          field="actions"
          label=" "
        >
          <b-button
            type="is-danger"
            @click="deleteNew(props.row.id)"
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
      <add-news :row="currentRow" />
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import AddNews from '../components/AddNews';

  export default {
    name: 'News',
    components: { AddNews },
    data() {
      return {
        data: [],
        loading: true,
        isModalActive: false,
        currentRow: null,
        isDelete: false
      };
    },
    computed: {
      url() {
        return `${process.env.VUE_APP_API}admNews/`;
      },
      linkImage() {
        return process.env.VUE_APP_URL;
      },
      newsText() {
        return process.env.VUE_APP_NEWS;
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
      deleteNew(row) {
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
        if (!this.isDelete) {
          this.currentRow = row;
          this.isModalActive = true;
        }
      }
    },
  };
</script>

<style scoped>
.image {
  max-width: 600px;
}

.add-news {
  display: flex;
  align-items: center;
}

.add-news__btn {
  margin-right: 20px;
}
</style>
