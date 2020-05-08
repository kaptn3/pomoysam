<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </header>
    <div class="card__content">
      <p v-if="object.coins4m">
        Всего жетонов, 4 мин: {{ object.coins4m }}
      </p>
      <p v-if="object.coins2m">
        Всего жетонов, 2 мин: {{ object.coins2m }}
      </p>
      <p v-if="object.total_summ">
        Общая сумма: {{ object.total_summ }} р.
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: {
      object: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    }
  };
</script>

<style scoped>
  .card__content {
    padding: 20px;
  }

  .card__content:not(:last-child) {
    border-bottom: 1px solid #dbdbdb;
    padding: 0.75rem;
  }
</style>
