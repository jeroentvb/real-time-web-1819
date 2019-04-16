function formatText (msg, char) {
  let regex
  let cssClass

  switch (char) {
    case '*':
      regex = /(\*[\w\d\s\W]*\*)/g
      cssClass = 'bold'
      break
    case '_':
      regex = /(_[\w\d\s\W]*_)/g
      cssClass = 'italic'
      break
    case '<':
      regex = /(<[\w\d\s\W]*>)/g
      cssClass = 'monospace'
      break
    case '-':
      regex = /(\^[\w\d\s\W]*\^)/g
      cssClass = 'strikethrough'
      break
  }

  msg.split(regex).forEach(item => {
    if (item.slice(0, 1) === char && item.slice(-1) === (char !== '<' ? char : '>')) {
      msg = msg.replace(item, `<span class="${cssClass}">${item.substring(1, item.length - 1)}</span>`)
    }
  })

  return msg
}

export const helper = {
  formatText
}
