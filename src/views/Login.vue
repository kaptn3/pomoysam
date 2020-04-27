<template>
  <div class="level-item login-page">
    <section class="columns login-page__section">
      <form
        class="column is-4 is-offset-4"
        @submit="submitForm"
      >
        <b-field
          label="Логин"
        >
          <b-input
            v-model="username"
            name="username"
            placeholder="Логин"
            required
          />
        </b-field>
        <b-field
          label="Пароль"
        >
          <b-input
            v-model="password"
            type="password"
            name="password"
            placeholder="Пароль"
            required
          />
        </b-field>
        <small
          v-if="error"
          class="help is-danger"
        >
          {{ error }}
        </small>
        <button class="button is-info login-page__btn">
          Войти
        </button>
      </form>
    </section>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Login',
    data() {
      return {
        error: '',
        username: '',
        password: ''
      };
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const url = `${process.env.VUE_APP_API}login/`;

        const data = {
          'username': this.username,
          'password': this.password
        };

        axios({
          method: 'POST',
          url,
          data
        })
          .then((res) => {
            const { token } = res.data;
            this.$store.commit('auth', token);
            this.error = '';
            this.$router.push('/adm-users');
          })
          .catch(() => {
            this.$store.commit('logout');
            this.error = 'Неправильный пароль/логин';
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .login-page {
    min-height: calc(100vh - 52px);

    &__btn {
      margin: auto;
      display: block;
    }

    &__section {
      flex-grow: 1;
    }
  }
</style>
