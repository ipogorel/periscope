import {WidgetContent} from './widget-content';
import {Query} from './../../data/query'
import $ from 'jquery';
import factoryDt from 'datatables';
import factoryDtBs from 'datatables.net-bs';
import factoryDtSelect from 'datatables.net-select';
import factoryDtResponsive from 'datatables.net-responsive'
import factoryDtResponsiveBs from 'datatables.net-responsive-bs';
import factoryDtKeytable from 'datatables.net-keytable';
import 'datatables.net-bs/css/datatables.bootstrap.css!';
import 'datatables.net-select-bs/css/select.bootstrap.css!';
import 'datatables.net-responsive-bs/css/responsive.bootstrap.css!';
import 'datatables.net-keytable-bs/css/keyTable.bootstrap.css!';

import * as _ from 'lodash';
/*
 npm install datatables.net-responsive
 npm install datatables.net-responsive-bs
*/

const DT_SELECT_EVENT = 'select.dt';
const DT_DESELECT_EVENT = 'deselect.dt';
const DT_DRAW_EVENT = 'draw.dt';
const DT_KEYFOCUS_EVENT = 'key-focus';

export class JqGridContent extends WidgetContent {
 constructor(widget){
   super(widget);
   this.columns = this.settings.columns? this.settings.columns : [];
   this.navigatable = this.settings.navigatable;
   this.autoGenerateColumns = this.settings.autoGenerateColumns;
   this.initGridLib();
 }

  initGridLib(){
    let dtObj = factoryDt(undefined, $);
    let dtSelectObj = factoryDtSelect(undefined, $);
    let dtObjBs = factoryDtBs(undefined, $);
    let dtObjResponsive = factoryDtResponsive(undefined, $);
    let dtObjResponsiveBs = factoryDtResponsiveBs(undefined, $);
    let dtObjKeytable = factoryDtKeytable(undefined, $);
  }

  set columns(value){
    this._columns = value;
  }
  get columns(){
    return this._columns;
  }

  set data(value){
    this._data = value;
  }
  get data(){
    return this._data;
  }

  set navigatable(value){
    this._navigatable = value;
  }
  get navigatable(){
    return this._navigatable;
  }


  get autoGenerateColumns(){
    return this._autoGenerateColumns;
  }
  set autoGenerateColumns(value){
    this._autoGenerateColumns = value;
  }

  attached(){
    this.createGrid();
  }

  refresh() {
      let self = this;
      var query = new Query();
      /*query.sort = options.data.sort;
      query.take = options.data.take;
      query.skip = options.data.skip;
      query.serverSideFilter = self.widget.dataFilter;*/
      self.widget.dataSource.getData(query).then(dH=>{
        self.data = dH.data;
      }, error => {
        self.data = [];
      });
  }



  createGrid(){
    this.dataTable = $(this.gridElement).DataTable({
      select: true,
      responsive: true,
      filter: false,
      data: this.data,
      keys: this.navigatable,
      columns: _.map(this.columns,c=>{
        return {
          data:c.field,
          sTitle:c.title?c.title:c.field,
          type: c.format,
          render: c.format? (data, type, full, meta) => {
            return data;
          }:{}
        };
      })
    });
    this.dataTable.on(DT_SELECT_EVENT, (e, d, t, idx) => this.onSelected(idx))
    this.dataTable.on(DT_DESELECT_EVENT, () => this.onDeselected())
    this.dataTable.on(DT_DRAW_EVENT, () => this.handleRedraw());
    this.dataTable.on(DT_KEYFOCUS_EVENT, ()=>this.onFocus());
    // handle double ckick
    var me = this;
    $(this.gridElement).find("tbody").on('dblclick', 'tr', e => {
      this.onActivated($(e.target.parentNode)[0]._DT_RowIndex);
    });
  }

  handleRedraw() {
    this.dataTable.rows().deselect();
  }

  onFocus(){
    var cell = this.dataTable.cell({ focused: true });
    var data = cell.data();
    var row = this.dataTable.rows(cell.index().row);
    //this.dataTable.row('.selected').remove();

  }

  onDeselected() {
    //this.deselectCallback.call(this.vm);
  }

  onSelected(idx) {
    this.widget.dataSelected.raise(this.data[idx]);
  }


  onActivated(idx){
    this.widget.dataActivated.raise(this.data[idx]);
  }

  dataChanged() {
    //this.logger.debug('data change detected - updating table');
    this.dataTable && this.dataTable.clear().rows.add(this.data).draw();
  }

  detached(){
    this.dataTable.off(DT_SELECT_EVENT);
    this.dataTable.off(DT_DESELECT_EVENT);
    this.dataTable.off(DT_DRAW_EVENT);
    this.dataTable.destroy();
  }

}
