
import { GalleryImage, Gallery, SeedableRNG } from "./gallery";

export class RealImageLoader extends GalleryImage {

  GetTypeName() : string {
    return "ImageLoader";
  }

  async GetDomElement() : Promise<any> {
    if (this.image == null) {
      let _img = await this.BareDomElement();
    }
    let _result = document.createElement('div');
    _result.style.background = "url("+this.imageUrl+")";
    _result.style['background-size'] = 'cover';
    return new Promise(resolve => { resolve(_result); });
  }

  GetAspectRatio() : number {
    return this.image.width / this.image.height;
  }
}
