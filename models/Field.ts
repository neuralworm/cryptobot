export default class Field {
    value: string
    name: string
    inline: boolean
    constructor(value: string, name: string, inline: boolean) {
      this.value = value
      this.name = name
      this.inline = inline
    }
  }