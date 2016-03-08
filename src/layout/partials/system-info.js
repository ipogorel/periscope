export class SystemInfo  {
  constructor()
  {
    this.version = "1.0.3";
    this.lastBuild = new Date().setDate(new Date().getDate()-1);
  }
}
