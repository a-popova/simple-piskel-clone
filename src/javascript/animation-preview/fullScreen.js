export default function fullScreen() {
  if (document.fullscreenEnabled || document.webkitFullscreenEnabled
    || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
    const element = document.getElementById('preview');
    if ('requestFullscreen' in element) {
      element.requestFullscreen();
    } else if ('webkitRequestFullscreen' in element) {
      element.webkitRequestFullscreen();
    } else if ('mozRequestFullScreen' in element) {
      element.mozRequestFullScreen();
    } else if ('msRequestFullscreen' in element) {
      element.msRequestFullscreen();
    }
  }
}
