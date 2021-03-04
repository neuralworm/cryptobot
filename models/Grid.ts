export default class Grid{
    width: number
    height: number
    coordinates: string[][]
    constructor(width: number = 40, height: number = 20){
        this.width = width
        this.height = height
        this.coordinates = this.init_coordinates()
    }

    init_coordinates(): string[][]{
        let array: string[][] = Array.from({length: this.height}, () => {
            return Array.from({length: this.width}, () => " ")
        })
        return array
    }
}