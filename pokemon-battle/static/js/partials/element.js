function create (element, cssClass) {
  if (!element) throw new Error('No element specified')

  const el = document.createElement(element)

  if (cssClass) el.classList.add(cssClass)

  return el
}

function img (src, cssClass) {
  if (!src) throw new Error('No image source specified')

  const img = document.createElement('img')

  img.src = src

  if (cssClass) {
    if (!Array.isArray(cssClass)) {
      img.classList.add(cssClass)
    } else {
      cssClass.forEach(css => img.classList.add(css))
    }
  }

  return img
}

function paragraph (text, cssClass) {
  if (!text) console.warn('No text passed')
  const p = document.createElement('p')
  if (text) {
    const content = document.createTextNode(text)
    p.appendChild(content)
  }

  if (cssClass) p.classList.add(cssClass)

  return p
}

function heading (type, content = '') {
  const headings = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ]

  if (!content) console.warn('No content given')
  if (headings.indexOf(type) === -1) {
    type = 'h1'
    console.warn('No existing heading type specified, h1 used.')
  }

  const heading = document.createElement(type)
  const text = document.createTextNode(content)

  heading.appendChild(text)

  return heading
}

function removeChildren (el) {
  while (el.firstChild) el.removeChild(el.firstChild)
}

function update (el, elements) {
  this.removeChildren(el)

  if (elements.length === undefined) {
    el.appendChild(elements)
  } else {
    elements.forEach(element => el.appendChild(element))
  }
}

function appendChildren (el, elements) {
  elements.forEach(element => el.appendChild(element))
}

export const element = {
  create,
  img,
  paragraph,
  heading,
  removeChildren,
  update,
  appendChildren
}
