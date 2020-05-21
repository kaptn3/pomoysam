<template>
  <div
    class="card"
    @click="$emit('click')"
  >
    <header class="card-header">
      <p class="card-header-title">
        {{ title }}
      </p>
    </header>
    <div class="card__content">
      <p>
        Стоимость жетона: {{ object.price }}
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CardPrice',
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
