import { h, render } from 'vue'
import { NImage } from 'naive-ui'

export const previewImage = (src: string) => {
  const imgs = h(NImage, { width: 100, src })
  let existDiv = document.querySelector('#preview-image')
  if (!existDiv) {
    const div = document.createElement('div')
    div.id = 'preview-image'
    div.style.display = 'none'
    document.body.appendChild(div)
    existDiv = div
  }
  render(imgs, existDiv)
  existDiv
    ?.querySelector('.n-image img')
    ?.dispatchEvent(new MouseEvent('click'))
}
