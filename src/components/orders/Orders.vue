<template>
  <div>富文本测试</div>
  {{ content }}
  <QuillEditor v-model="content"></QuillEditor>
</template>

<script>
import QuillEditor from '../quilleditor/quill-editor'

export default {
  name: 'Orders',
  components: {
    QuillEditor
  },
  data () {
    return {
      content: ''
    }
  }
}
</script>

<style scoped>

</style>
