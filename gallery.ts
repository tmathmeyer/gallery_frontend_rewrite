

abstract class GalleryImage {
  constructor(public imageUrl: string) {}

  public GetUniqueID() : string {
    return this.GetTypeName() + '_' + btoa(this.imageUrl);
  }

  /* TODO: replace with reflection */
  abstract GetTypeName() : string;

  /* Gives subclasses an opportunity to tweak the dom element */
  abstract GetDomElement() : HTMLElement;

  /* Subclasses can use this to get a basic element */
  protected BareDomElement() : HTMLElement {
    let _element = document.createElement('img');
    _element.id = this.GetUniqueID();
    _element.src = this.imageUrl;
    return _element;
  }
}


class Gallery {

  private tileCoords : number[][];
  private imageElementMap : Map<string, [GalleryImage, HTMLElement]>;
  private eventHandlers : Map<string, Map<string, (img: GalleryImage)=>void>>;
  private listenerInterceptors : Map<string, (event)=>void>;

  /* default constructor */
  constructor(private galleryElementId: string, private gridColumns: number) {
    this.imageElementMap = new Map();
    this.eventHandlers = new Map();
    this.listenerInterceptors = new Map();
  }

  private generateUniqueId() : string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  private repaint() {

  }

  private createNewListenerInterception(event: string) {
    let _this_capture = this;
    if (!this.listenerInterceptors.has(event)) {
      this.listenerInterceptors.set(event, (e) => {
        let _gallery_image : GalleryImage = _this_capture.imageElementMap[e.target.id][0];
        if(_this_capture.eventHandlers.has(event)) {
          for(let id in _this_capture.eventHandlers.get(event)) {
            _this_capture.eventHandlers.get(event).get(id)(_gallery_image);
          }
        }
      });
    }
  }

  private applyListeners(element: HTMLElement) {
    for(let event in this.listenerInterceptors) {
      element.addEventListener(event, this.listenerInterceptors[event]);
    }
  }

  public SetExcludedTiles(tileCoords: number[][]) {
    this.tileCoords = tileCoords;
    this.repaint();
  }

  public Render(images: GalleryImage[]) {
    for(let img of images) {
      let _dom_element = img.GetDomElement();
      this.applyListeners(_dom_element);
      this.imageElementMap[img.GetUniqueID()] = [img, _dom_element];
    }
    this.repaint();
  }

  public OnEvent(event: string, callback: (GalleryImage) => void) : string {
    if (!(event in this.eventHandlers)) {
      this.createNewListenerInterception(event);
      this.eventHandlers[event] = new Map();
    }
    let _result_key = this.generateUniqueId();
    this.eventHandlers[event][_result_key] = callback;
    return _result_key;
  }

  public StopListening(event: string, listener_id: string) {
    if (this.eventHandlers.has(event)) {
      if (this.eventHandlers[event].has(listener_id)) {
        this.eventHandlers[event].delete(listener_id);
      }
    }
  }

}