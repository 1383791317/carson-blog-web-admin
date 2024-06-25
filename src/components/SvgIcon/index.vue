<template>
  <svg aria-hidden="true":style="{fontSize: size, width: width, height: heigh}">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"

export default defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "icon",
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "#333333",
    },
    size: {
      type: String,
      default: "14px",
    },
    width: {
      type: String,
      default: "20px",
    },
    heigh: {
      type: String,
      default: "20px",
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    return { symbolId }
  },
})
</script>
