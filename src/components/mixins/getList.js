import axios from 'axios';

export default {
  data() {
    return {
      carWashList: [],
      objectId: null,
      techs: null,
      chemSort: []
    };
  },
  methods: {
    getCarWashList() {
      const url = `${process.env.VUE_APP_API}razmenCarWashList/`;
      axios.get(url)
        .then((res) => {
          this.carWashList = res.data;
        })
        .catch(() => {
          this.$router.push('/login');
        });
    },
    getTechs() {
      const url = `${process.env.VUE_APP_API}getTehs/`;
      axios.get(url)
        .then((res) => {
          this.techs = res.data;
        })
        .catch(() => {
          this.$router.push('/login');
        });
    },
    getChemSort() {
      const url = `${process.env.VUE_APP_API}admChemSort/`;
      axios.get(url, this.$store.getters.config)
        .then((res) => {
          this.chemSort = res.data;
        })
        .catch(() => {
          this.$router.push('/login');
        });
    }
  }
};
