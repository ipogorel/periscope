export class PermissionsManagerConfiguration {
  permissionsMatrix = [];
  authentication;

  withPermissionsMatrix(matrix){
    this.permissionsMatrix = matrix;
    return this;
  }

  withAuthinticationManager(authentication){
    this.authentication = authentication;
    return this;
  }
}
