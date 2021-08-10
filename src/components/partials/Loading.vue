<template>
  <div class="loading">
    <div class="text mb-3">
      Loading data...
    </div>
    <svg
      id="load"
      x="0px"
      y="0px"
      viewBox="0 0 150 150">
      <circle
        id="loading-inner"
        cx="75"
        cy="75"
        r="60"/>
    </svg>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .loading {
    text-align: center;
    #load {
      width: 75px;
      animation: loading 3s linear infinite;
      #loading-inner {
        stroke: {
          dashoffset: 0;
          dasharray: 300;
          width: 10;
          miterlimit: 10;
          linecap: round;
        }
        animation: loading-circle 2s linear infinite;
        stroke: #5d6ee7;
        fill: transparent;
      }
    }
    @keyframes loading {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    @keyframes loading-circle {
      0% {
        stroke-dashoffset: 0
      }
      100% {
        stroke-dashoffset: -600;
      }
    }
  }
</style>
