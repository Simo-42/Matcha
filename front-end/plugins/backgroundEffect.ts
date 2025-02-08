export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    mounted() {
      const blendAmount = 45;
      const delay = 2;
      let windowWidth = window.innerWidth;

      window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;
      });

      document.onmousemove = function(e) {
        const mouseX = Math.round(e.pageX / windowWidth * 100 - delay);
        const col1 = mouseX - blendAmount;
        const col2 = mouseX + blendAmount;
        document.body.style.background = `linear-gradient(to right, rgb(51, 3, 105) ${col1}%, rgb(138, 0, 80) ${col2}%)`;
      }
    }
  });
});
