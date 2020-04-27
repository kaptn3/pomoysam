<template>
  <div class="container">
    <users-table
      :loading="loading"
      :data="body"
    />
  </div>
</template>

<script>
  import axios from 'axios';
  import UsersTable from '../components/UsersTable';

  export default {
    name: 'AdmUsers',
    components: { UsersTable },
    data() {
      return {
        body: [],
        isModalActive: false,
        loading: false
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        this.loading = true;
        const url = `${process.env.VUE_APP_API}admUsers/`;
        axios
          .get(url, this.$store.getters.config)
          .then((res) => {
            this.body = res.data.resp;
            this.loading = false;
          })
          .catch(() => {
            this.$router.push('/login');
          });
      }
    }
  };
</script>
