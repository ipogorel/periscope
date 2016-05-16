import {DataHelper} from './../data-helper';
import numeral from 'numeral';
import moment from 'moment';

export class FormatValueConverter {
  static format(value, format){
    if (DataHelper.isDate(value))
      return moment(value).format(format);
    if (DataHelper.isNumber(value))
      return numeral(value).format(format);
    return value;
  }

  toView(value, format) {
    return FormatValueConverter.format(value, format);
  }
}
