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
        Установить стоимость жетона
      </h2>
      <b-field label="Баланс">
        <b-input
          v-model="price"
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
      id: {
        type: Number,
        required: true
      },
      oldPrice: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        status: '',
        newPrice: null
      };
    },
    computed: {
      price: {
        get() {
          return this.oldPrice;
        },
        set(value) {
          this.newPrice = value;
        }
      }
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('id', this.id);
        data.set('new_price', this.newPrice || this.price);
        const url = `${process.env.VUE_APP_API}admRazmenPrice/`;
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
