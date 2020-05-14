<template>
  <b-table
    :data="data"
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
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Faq',
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
          }
        ]
      };
    },
    mounted() {
      this.getFaq();
    },
    methods: {
      getFaq() {
        const url = `${process.env.VUE_APP_API}admFaq/`;
        axios.get(url, this.$store.getters.config)
          .then((res) => {
            this.data = res.data;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      }
    }
  };
</script>
