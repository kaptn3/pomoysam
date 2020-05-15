<template>
  <div class="add-faq">
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
        Добавить
      </h2>
      <b-field label="Вопрос">
        <b-input
          v-model="question"
          required
        />
      </b-field>
      <b-field label="Ответ">
        <b-input
          v-model="answer"
          maxlength="200"
          type="textarea"
          required
        />
      </b-field>
      <button class="button is-info is-fullwidth">
        {{ btnText }}
      </button>
    </form>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'AddFaq',
    props: {
      row: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        status: '',
        questionText: null,
        answerText: null
      };
    },
    computed: {
      question: {
        get() {
          if (this.row) {
            return this.row.question;
          }
          return '';
        },
        set(value) {
          this.questionText = value;
        }
      },
      answer: {
        get() {
          if (this.row) {
            return this.row.answer;
          }
          return '';
        },
        set(value) {
          this.answerText = value;
        }
      },
      btnText() {
        return this.row ? 'Сохранить' : 'Добавить';
      },
      url() {
        return `${process.env.VUE_APP_API}admFaq/`;
      }
    },
    methods: {
      submitForm(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('answer', this.answerText || this.answer);
        data.set('question', this.questionText || this.question);
        if (this.row) {
          data.set('id', this.row.id);
        }
        const method = this.row ? 'put' : 'post';
        axios({
          method,
          url: this.url,
          data,
          headers: {
            Authorization: `Token ${this.$store.state.token}`
          }
        })
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
.add-faq {
  background-color: white;
  padding: 20px;
}
</style>
