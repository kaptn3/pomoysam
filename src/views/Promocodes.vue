<template>
  <section class="container">
    <b-table
      :data="body"
      :columns="head"
      :loading="loading"
      :hoverable="true"
      :mobile-cards="true"
    >
      <template slot="empty">
        <section class="content has-text-grey has-text-centered">
          <p>Данные не найдены</p>
        </section>
      </template>
    </b-table>
  </section>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Promocodes',
    data() {
      return {
        loading: true,
        data: [],
        head: [
          {
            field: 'code',
            label: 'Промо-код'
          },
          {
            field: 'type',
            label: 'Тип промо-кода'
          },
          {
            field: 'coins2m',
            label: 'Жетонов на 4 мин'
          },
          {
            field: 'coins4m',
            label: 'Жетонов на 2 мин'
          },
          {
            field: 'discount_percent',
            label: 'Скидка, %'
          },
          {
            field: 'active',
            label: 'Активность'
          }
        ]
      };
    },
    computed: {
      body() {
        const body = this.data;

        for (let i = 0; i < this.data.length; i++) {
          body[i].type = (this.data[i].type !== 1 && this.data[i].type !== 'Скидка') ? 'Бесплатный QR код' : 'Скидка';
          body[i].active = (this.data[i].active !== true && this.data[i].active !== '✔') ? '-' : '✔';
        }

        return body;
      }
    },
    mounted() {
      this.getPromo();
    },
    methods: {
      getPromo() {
        this.loading = true;
        axios.get(`${process.env.VUE_APP_API}admPromo/`, this.$store.getters.config)
          .then((res) => {
            this.data = res.data;
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      }
    }
  };
</script>
