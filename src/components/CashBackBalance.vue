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
        Установить бонусный баланс
      </h2>
      <b-field label="Баланс">
        <b-input
          v-model="balance"
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
    name: 'AddFaq',
    props: {
      userId: {
        type: Number,
        required: true
      },
      oldBalance: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        status: '',
        newBalance: null
      };
    },
    computed: {
      balance: {
        get() {
          return this.oldBalance;
        },
        set(value) {
          this.newBalance = value;
        }
      }
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('user_id', this.userId);
        data.set('new_balance', this.newBalance || this.balance);
        const url = `${process.env.VUE_APP_API}admCashBackBalance/`;
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
