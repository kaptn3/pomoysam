<template>
  <div class="add-faq">
    <b-message
      v-if="status === 'ok'"
      type="is-success"
    >
      Готово
    </b-message>
    <b-message
      v-if="status === 'error'"
      type="is-warning"
    >
      Произошла ошибка
    </b-message>
    <form
      v-if="status === ''"
      @submit="submitForm"
    >
      <h2 class="title is-3">
        {{ btnText }}
      </h2>
      <img
        v-if="row"
        :src="linkImage + row.image"
      >
      <b-field class="file">
        <b-upload
          v-model="image"
          :required="!row"
          accept="image/*"
        >
          <a class="button is-info">
            <b-icon icon="upload" />
            <span>Загрузить файл</span>
          </a>
        </b-upload>
        <span
          v-if="image"
          class="file-name"
        >
          {{ image.name }}
        </span>
      </b-field>
      <b-field label="Сортировка">
        <b-input v-model="sort" />
      </b-field>
      <button class="button is-info is-fullwidth">
        {{ btnText }}
      </button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'AddNews',
    props: {
      row: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        status: '',
        sortText: null,
        image: null
      };
    },
    computed: {
      sort: {
        get() {
          if (this.row) {
            return this.row.sort_field;
          }
          return '';
        },
        set(value) {
          this.sortText = value;
        }
      },
      linkImage() {
        return process.env.VUE_APP_URL;
      },
      btnText() {
        return this.row ? 'Сохранить' : 'Добавить';
      }
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('image', this.image);
        data.set('sort_field', this.sortText || this.sort);
        if (this.row) {
          data.set('id', this.row.id);
        }
        const method = this.row ? 'put' : 'post';
        axios({
          method,
          url: `${process.env.VUE_APP_API}admNews/`,
          data,
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        })
          .then(() => {
            this.status = 'ok';
          })
          .catch(() => {
            this.status = 'error';
          });
      }
    }
  };
</script>

<style scoped>
.add-faq {
  background-color: white;
  padding: 20px;
}
</style>
