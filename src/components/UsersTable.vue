<template>
  <section>
    <a-table
      :body="body"
      :head="head"
      :loading="loading"
    />
  </section>
</template>

<script>
  import ATable from './ATable';

  export default {
    name: 'UsersTable',
    components: {
      ATable
    },
    props: {
      data: {
        type: Array,
        default() { return []; }
      },
      loading: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        head: [
          {
            field: 'phone',
            label: 'Номер телефона'
          },
          {
            field: 'register_date',
            label: 'Дата регистрации'
          },
          {
            field: 'coins_cnt',
            label: 'Всего жетонов'
          },
          {
            field: 'balance',
            label: 'Бонусный баланс'
          }
        ]
      };
    },
    computed: {
      body() {
        const body = this.data;

        for (let i = 0; i < this.data.length; i++) {
          const coinsCnt = this.data[i].coins_cnt;
          if (coinsCnt === null) {
            body[i].coins_cnt = 0;
          }
        }

        return body;
      }
    }
  };
</script>
