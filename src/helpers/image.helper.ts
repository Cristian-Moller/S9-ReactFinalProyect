export default class Helper {

  getImageOrDefault(currentImage : ArrayBuffer | string | undefined | null, defaultImage: string) : string {
    if(currentImage !== null && currentImage !== undefined) {
      return currentImage as string;
    }
  
    return defaultImage;
  }
}
