import './ui.css'

const radioLabelShare = document.getElementById('linkTypeShareLabel')
const radioLabelUrls = document.getElementById('linkTypeUrlLabel')
const radiosShare = document.querySelector(['[name="linkTypeShare"]'])
const radioUrls = document.querySelector(['[name="linkTypeUrl"]'])
const urlsExpand = document.getElementById('shareUrls')
const textarea = document.getElementById('ta')
const exportBtn = document.getElementById('export')

exportBtn.onclick = () => {
  parent.postMessage({ pluginMessage: 'export' }, '*')
}

radioLabelShare.onclick = () => {
  urlsExpand.hidden = true
  radioUrls.checked = false
  radiosShare.checked = true
  textarea.style.height = '375px'
}
radioLabelUrls.onclick = () => {
  urlsExpand.hidden = false
  radioUrls.checked = true
  radiosShare.checked = false
  textarea.style.height = '250px'
}

onmessage = event => {
  const message = event.data.pluginMessage
  const flexDir = (message.dir == 'x' ? 'row' : 'col')

  if (message.type == 'selections') {
    let lis = ``
    message.selections.forEach((x, i) => {
      let liClass = ''
      if (message.margins[i] > 0) {
        liClass += ' class="m' + (message.dir == 'x' ? 'l' : 't') + '-' + message.margins[i] + '"'
      }
      let link = 'javascript:;'
      let $link = document.querySelector(`[name="${x.name}Url"]`)
      if (radiosShare.checked) {
        if (x.name == 'facebook') {
          link = 'https://www.facebook.com/sharer.php?u='
        }
        if (x.name == 'twitter') {
          link = 'https://twitter.com/intent/tweet?url=&text=&via='
        }
        if (x.name == 'linkedin') {
          link = 'https://www.linkedin.com/sharing/share-offsite/?url='
        }
      } else if (radioUrls.checked && $link.value) {
        link = $link.value
      }
      lis += `
  <li${liClass}>
    <a href="${link}">
      ${x.svg}
    </a>
  </li>`
    })
    textarea.value = `<ul class="flex flex-${flexDir}">${lis}
</ul>`
  }
}