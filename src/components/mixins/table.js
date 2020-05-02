export default {
  data() {
    return {
      loading: true,
      data: [],
      cnt: 0,
      page: 0,
      dateFrom: null,
      dateTo: null,
      dateFromString: null,
      dateToString: null
    };
  },
  methods: {
    seeMore() {
      this.page += 1;
      this.getData(true);
    },
    applyFilters() {
      this.page = 0;
      this.dateFromString = this.dateFrom ? this.dateFrom.toLocaleDateString() : null;
      this.dateToString = this.dateTo ? this.dateTo.toLocaleDateString() : null;
      this.getData();
    },
    resetArray(filters) {
      let arr1 = [
        'page',
        'dateFrom',
        'dateTo',
        'dateFromString',
        'dateToString'
      ];
      arr1 = arr1.concat(filters);
      for (let i = 0; i < arr1.length; i++) {
        this[arr1[i]] = null;
      }
      this.getData();
    }
  }
};
