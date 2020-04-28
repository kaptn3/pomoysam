<template>
  <div class="container">
    <users-table />
  </div>
</template>

<script>
  import UsersTable from '../components/UsersTable';

  export default {
    name: 'AdmUsers',
    components: { UsersTable }
  };
</script>
