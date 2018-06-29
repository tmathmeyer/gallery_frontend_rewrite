
import { GalleryImage, Gallery, SeedableRNG } from ".//gallery";



class ColorfulBullshit extends GalleryImage {

  public aspect_ratio: number = 1;

  GetTypeName() : string {
    return "BULLSHIT";
  }

  GetDomElement() : HTMLElement {
    let _element = this.BareDomElement();
    let _color = '#'
    for (let i=0; i<6; i++) {
      _color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
    }
    _element.style['background-color'] = _color;
    return _element;
  }

  GetAspectRatio() : number {
    return this.aspect_ratio;
  }
}

function doBasic() {
  let _g = new Gallery("gallery", 14, 2);
  let _a = []
  let _rng = new SeedableRNG();
  _rng.Seed(123543);
  for(let i=0; i<8; i++) {
    let _rat = new ColorfulBullshit("foo.jpg");
    let _num = Math.floor(_rng.next(3, 6));
    let _den = Math.floor(_rng.next(3, 6));
    _rat.aspect_ratio = _num / _den;
    _a.push(_rat);
  }

  _g.Render(_a);
}