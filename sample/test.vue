<template>
   <div class="wrapper">
    <div v-if="hello">
      <span @click="hello"></span>
      </div>
    </div>
</template>

<script>
export default {
  data: {
    hello: 'h'
  }
}
</script>
