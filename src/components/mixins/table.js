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
    applyFilters(time) {
      this.page = 0;
      if (time) {
        this.dateFromString = this.dateFrom ? `${this.dateFrom.toLocaleDateString()},${(this.dateFrom.toLocaleTimeString()).slice(0, -3)}` : null;
        this.dateToString = this.dateTo ? `${this.dateTo.toLocaleDateString()},${(this.dateTo.toLocaleTimeString()).slice(0, -3)}` : null;
      } else {
        this.dateFromString = this.dateFrom ? this.dateFrom.toLocaleDateString() : null;
        this.dateToString = this.dateTo ? this.dateTo.toLocaleDateString() : null;
      }
      this.getData();
    },
    convertTime(time) {
      return time ? `${time.toLocaleDateString()},${(time.toLocaleTimeString()).slice(0, -3)}` : null;
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
