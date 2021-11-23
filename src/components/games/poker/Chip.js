class PokerChip{
  constructor() {
    this.chipTypes = [100, 25, 5, 1];
  }

  build(total){
    let chips = {};

    this.chipTypes.forEach( type => {
      let c = Math.floor(total/type);
      chips[`chip_${type}`] = c;
      total = total - c * type;
    });

    return chips;
  }
}

const chip = new PokerChip();
export { chip as default };