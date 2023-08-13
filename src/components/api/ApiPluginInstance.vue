<template>
  <div class="p-container" :style="{ 'background-color': bgColor(data) }">
    <div>
      <span class="p-name">{{ data.name }}</span>
      <span class="p-version">{{ data.version }}</span>
      <span class="p-extra">
        <slot name="extra"></slot>
      </span>
    </div>
    <div>
      <p class="p-desc">
        {{ data.description }}
      </p>
    </div>
  </div>
</template>

<script setup>

defineProps({
  data: Object
})

const bgColor = (data) => data.tail ? 'burlywood' : 'beige'

</script>

<style scoped>
.p-container {
  height: 118px;
  min-height: 118px;
  max-height: 118px;
  padding: 10px;
  margin: 10px 5% 10px 10px;
  overflow: hidden;
  border: 1px solid #000;
  border-radius: 10px;
  text-overflow: ellipsis;
}

.p-container[draggable=true]:hover {
  border: 2px solid #000;
  box-shadow: 5px 5px 5px 5px rgba(1, 1, 1, 0.3);
  cursor: pointer;
  transform-origin: bottom left;
  transform: translateZ(10px) scale(1.02);
}

.p-container[draggable=false]:hover {
  cursor: not-allowed;
  user-select: none;
}

.p-name {
  font-size: 1.2rem;
  font-weight: 600;
}

.p-version {
  font-size: 0.9rem;
  font-weight: 200;
  padding-left: 1rem
}

.p-extra {
  float: right;
}

.p-desc {
  text-overflow: ellipsis;
}
</style>
