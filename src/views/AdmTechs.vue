<template>
  <div>
    <div class="columns is-multiline">
      <div
        v-for="(item, name) in data"
        :key="name"
        class="column"
      >
        <content-card
          :title="name"
          :array="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import table from '../components/mixins/table';
  import ContentCard from '../components/ContentCard';

  export default {
    name: 'AdmTechs',
    components: { ContentCard },
    mixins: [table],
    data() {
      return {
        data: null
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData(more) {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admTehs/`;
        const config = {
          params: {},
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        };
        axios
          .get(url, config)
          .then((res) => {
            if (more) {
              this.data = this.data.concat(res.data.resp);
            } else {
              this.data = res.data.resp;
            }
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      }
    }
  };
</script>
