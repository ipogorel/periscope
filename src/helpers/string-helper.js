export class StringHelper {

  static compare (string1, string2) {
    return string1.toUpperCase() === string2.toUpperCase();
  }

  static replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  static hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  static getEditDistance(a, b){
    if(a.length == 0) return b.length;
    if(b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
      matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
      for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
            Math.min(matrix[i][j-1] + 1, // insertion
              matrix[i-1][j] + 1)); // deletion
        }
      }
    }

    return matrix[b.length][a.length];
  }

  static getPreviousWord(str, position, separators){
    //var str = searchStr.substring(0, this.caretPosition).toLowerCase();
    var str = str.substring(0, position);
    var lastSeparatorIndex = 0;
    for(let i=0; i < separators.length; i++) {
      if (str.lastIndexOf(separators[i])>lastSeparatorIndex)
        lastSeparatorIndex = str.lastIndexOf(separators[i]);
    }
    if (lastSeparatorIndex == str.length)
      lastSeparatorIndex=0;
    if ((lastSeparatorIndex>0)&&(lastSeparatorIndex < str.length))
      lastSeparatorIndex++;

    return str.substring(lastSeparatorIndex, str.length);
  }

  static getNextWord(str, position, separators){
    var str = str.substring(position, str.length);
    var firstSeparatorIndex = str.length;
    for(let i=0; i < separators.length; i++) {
      if ((str.indexOf(separators[i])<firstSeparatorIndex)&&(str.indexOf(separators[i])>=0))
        firstSeparatorIndex = str.indexOf(separators[i]);
    }
    return str.substring(0, firstSeparatorIndex);
  }
}
