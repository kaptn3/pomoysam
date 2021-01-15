<template>
  <div class="modal-div">
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
        Редактирование
      </h2>
      <b-field label="ФИО">
        <b-input
          v-model="name"
          required
        />
      </b-field>
      <b-field label="Пароль">
        <b-input
          v-model="password"
          type="password"
          required
        />
      </b-field>
      <button class="button is-info is-fullwidth">
        Сохранить
      </button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'ChangePrice',
    props: {
      oldName: {
        type: String,
        required: true
      },
      id: {
        type: Number,
        required: true
      },
      userType: {
        type: String,
        default: 'admEditTehs'
      }
    },
    data() {
      return {
        status: '',
        newName: null,
        password: null
      };
    },
    computed: {
      name: {
        get() {
          return this.oldName;
        },
        set(value) {
          this.newName = value;
        }
      }
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('id', this.id);
        data.set('name', this.newName || this.name);
        data.set('password', this.password);
        const url = `${process.env.VUE_APP_API}${this.userType}/`;
        axios.post(url, data, this.$store.getters.config)
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
.modal-div {
  background-color: white;
  padding: 20px;
}
</style>
