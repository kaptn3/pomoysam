<template>
  <div class="add-broken">
    <b-message
      v-if="status === 'ok'"
      type="is-success"
    >
      Готово
    </b-message>
    <b-message
      v-if="status === 'error'"
      type="is-warning"
    >
      Произошла ошибка
    </b-message>
    <form
      v-if="status === ''"
      @submit="submitForm"
    >
      <h2 class="title is-3">
        Создать задачу
      </h2>
      <b-field label="Выбрать объект">
        <b-select
          v-model="object"
          placeholder="Выбрать объект"
          required
          expanded
        >
          <option
            v-for="option in carWashList"
            :key="option.id"
            :value="option.id"
          >
            {{ option.car_wash_addr }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Текст задачи">
        <b-input
          v-model="text"
          maxlength="200"
          type="textarea"
          required
        />
      </b-field>
      <button class="button is-info is-fullwidth">
        Создать задачу
      </button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';
  import getList from './mixins/getList';

  export default {
    name: 'AddTask',
    mixins: [getList],
    data() {
      return {
        status: '',
        text: null,
        object: null
      };
    },
    mounted() {
      this.getCarWashList();
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('car_wash_id', this.object);
        data.set('description', this.text);
        axios.post(`${process.env.VUE_APP_API}sendBrokenRequest/`, data, this.$store.getters.config)
          .then(() => {
            this.status = 'ok';
          })
          .catch(() => {
            this.status = 'error';
          });
      }
    }
  };
</script>

<style scoped>
.add-broken {
  background-color: white;
  padding: 20px;
}
</style>
