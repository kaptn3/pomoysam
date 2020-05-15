<template>
  <div class="card">
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
        Начислить бесплатные жетоны
      </h2>
      <b-field label="Номер телефона">
        <b-input
          v-model="phone"
          placeholder="Номер телефона"
          required
        />
      </b-field>
      <b-field label="Количество QR-кодов">
        <b-input
          v-model="qrCnt"
          placeholder="Количество QR-кодов"
          required
        />
      </b-field>
      <b-field label="Жетонов на 2 минуты">
        <b-input
          v-model="coins2mCnt"
          placeholder="Жетонов на 2 минуты"
          required
        />
      </b-field>
      <b-field label="Жетонов на 4 минуты">
        <b-input
          v-model="coins4mCnt"
          placeholder="Жетонов на 4 минуты"
          required
        />
      </b-field>
      <b-field label="Комментарий">
        <b-input
          v-model="comment"
          type="textarea"
          placeholder="Комментарий"
          required
        />
      </b-field>
      <button class="button is-info is-fullwidth">
        Применить
      </button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'CreateFreeQr',
    data() {
      return {
        status: '',
        phone: null,
        qrCnt: null,
        coins2mCnt: null,
        coins4mCnt: null,
        comment: null
      };
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const body = new FormData();
        body.set('phone', this.phone);
        body.set('qr_cnt', this.qrCnt);
        body.set('coins2m_cnt', this.coins2mCnt);
        body.set('coins4m_cnt', this.coins4mCnt);
        body.set('free_comment', this.comment);

        const url = `${process.env.VUE_APP_API}createFreeQR/`;
        axios.post(url, body, this.$store.getters.config)
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
  .card {
    padding: 30px;
  }

  .button {
    margin-top: 20px;
  }
</style>
