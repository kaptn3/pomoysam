<template>
  <section>
    <b-table
      :data="body"
      :columns="head"
      :hoverable="true"
      :loading="loading"
      :mobile-cards="true"
    >
      <template slot="empty">
        <section class="content has-text-grey has-text-centered">
          <p>Данные не найдены</p>
        </section>
      </template>
    </b-table>
  </section>
</template>

<script>
  export default {
    name: 'ATable',
    props: {
      body: {
        type: Array,
        default() { return []; }
      },
      head: {
        type: Array,
        default() { return []; }
      },
      loading: {
        type: Boolean,
        required: true
      }
    }
  };
</script>
