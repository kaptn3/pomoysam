<template>
  <div class="columns is-multiline">
    <div
      v-for="(item, index) in data"
      :key="index + 'rest-chem-card'"
      class="column is-3"
    >
      <card
        :array="item"
        :title="index"
      />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Card from '@/components/CardWithNumber';

  export default {
    name: 'RestChem',
    components: { Card },
    data() {
      return {
        data: []
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        const url = `${process.env.VUE_APP_API}admChemCnt/`;
        const config = {
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        };
        axios
          .get(url, config)
          .then((res) => {
            this.data = res.data;
            console.log(res.data);
          })
          .catch(() => {
            this.$router.push('/login');
          });
      }
    }
  };
</script>
