export default class Comparison{
    comparison_indexes:  number[]
    prices: any
    constructor(comparison_indexes: number[], prices: any){
        this.comparison_indexes = comparison_indexes
        this.prices = prices
        console.log('rendering comparison of' + this.comparison_indexes)
    }
    getRow(index: number): string{
        let row = ''
        // console.log(this.prices.data[index])
        row += this.getCell(5, this.prices.data[index].symbol, false)
        row += this.getCell(10, this.prices.data[index].name, false)
        row += this.getCell(7, this.prices.data[index].quote.USD.percent_change_1h.toFixed(2) + "%")
        row += this.getCell(7, this.prices.data[index].quote.USD.percent_change_24h.toFixed(2) + "%")
        row += this.getCell(7, this.prices.data[index].quote.USD.percent_change_7d.toFixed(2) + "%")

        return `${row}\n`
    }
    getCell(width: number, string: string, padding: boolean = true): string{
        let substring = string.toString().substr(0, width)
        substring = padding ? substring.padStart(width, " ") : substring.padEnd(width, " ") 
        return `[${substring}]`
    }
    render(): any{
        let header = `[SYMB ][NAME      ][     1H][    24H][     7D][   1M][VOLUME  ]\n`
        this.comparison_indexes.forEach((index)=>{
            header += this.getRow(index)
        })
        return `\`\`\`${header}\`\`\``
    }
}