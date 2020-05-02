<template>
  <div
    v-if="carWashAddr"
    class="card"
  >
    <p>Использован: {{ carWashAddr }}</p>
    <p>Дата использования: {{ useDate }}</p>
    <p>Время использования: {{ useTime }}</p>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'AdmUsedQrInfo',
    props: {
      qrCode: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        carWashAddr: '',
        useDate: '',
        useTime: ''
      };
    },
    mounted() {
      const url = `${process.env.VUE_APP_API}admUsedQrInfo/?qr_code=${this.qrCode}`;
      axios.get(url, this.$store.getters.config)
        .then((res) => {
          this.carWashAddr = res.data.car_wash.car_wash_addr;
          this.useDate = res.data.use_date;
          this.useTime = res.data.use_time;
        })
        .catch(() => {
          this.$router.push('/login');
        });
    }
  };
</script>

<style scoped>
.card {
  padding: 20px;
}
</style>
