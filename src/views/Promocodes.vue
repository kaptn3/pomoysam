<template>
  <section class="container">
    <b-button
      type="is-info"
      @click="isModalActive = true"
    >
      Добавить
    </b-button>
    <b-table
      :data="body"
      :columns="head"
      :loading="loading"
      :hoverable="true"
      :mobile-cards="true"
      @click="addPromocode"
    >
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
      <add-promocode :row="currentRow" />
    </b-modal>
  </section>
</template>

<script>
  import axios from 'axios';
  import AddPromocode from '../components/AddPromocode';

  export default {
    name: 'Promocodes',
    components: { AddPromocode },
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
        ],
        isModalActive: false,
        currentRow: null
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
    watch: {
      isModalActive() {
        if (!this.isModalActive) {
          this.currentRow = null;
          this.getPromo();
        }
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
      },
      addPromocode(row) {
        this.currentRow = row;
        this.isModalActive = true;
      }
    }
  };
</script>
