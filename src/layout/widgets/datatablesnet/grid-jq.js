import {Grid} from './../grid';
import {Query} from './../../../data/query'
import {FormatValueConverter} from './../../../helpers/converters/value-format'
import $ from 'jquery';

import factoryDt from 'datatables';
import factoryDtBs from 'datatables.net-bs';
import factoryDtSelect from 'datatables.net-select';
import factoryDtScroller from 'datatables.net-scroller';
import factoryDtKeytable from 'datatables.net-keytable';

import 'datatables.net-bs/css/datatables.bootstrap.css!';
import 'datatables.net-select-bs/css/select.bootstrap.css!';
import 'datatables.net-keytable-bs/css/keyTable.bootstrap.css!';

import * as _ from 'lodash';

const DT_SELECT_EVENT = 'select.dt';
const DT_DESELECT_EVENT = 'deselect.dt';
const DT_DRAW_EVENT = 'draw.dt';
const DT_DRAW_PAGE = 'page.dt';
const DT_KEYFOCUS_EVENT = 'key-focus';
const DT_KEY_EVENT = 'key';

export class GridJq extends Grid {
 constructor(settings){
   super(settings);
   this.selectedColumnIndex = -1;
   this.initGridLib();
 }

  initGridLib(){
    let dtObj = factoryDt(undefined, $);
    let dtObjBs = factoryDtBs(undefined, $);
    let dtSelectObj = factoryDtSelect(undefined, $);
    let dtObjKeytable = factoryDtKeytable(undefined, $);
    let dtObjScroller = factoryDtScroller(undefined, $);
  }


  attached(){
    this.createGrid();
  }

  refresh() {
    super.refresh();
    if (!this.dataTable)
      return;

    if (this.autoGenerateColumns) {
      this.createColumns().then(()=> {
        this.detached();
        this.createGrid();
      })
    }
    else
      this.dataTable.draw();
  }


  createGrid(){
    var me = this;
    this.dataTable = $(this.gridElement).DataTable({
      select: true,
      lengthChange: false,

      scrollY: this._calculateHeight($(this.gridElement)),
      deferRender: true,
      scroller: true,
      paging: true,
      pagingType: "simple",

      processing: true,
      responsive: true,
      order: [],
      filter: false,
      serverSide:true,
      ajax: (request, drawCallback, settings)=>{
        if (!me.dataSource) {
          drawCallback({data: []});
          return;
        }
        var query = new Query();
        query.take = request.length;
        query.skip = request.start;
        if (request.order.length>0){
          query.sort = me.columns[request.order[0].column].field;
          query.sortDir = request.order[0].dir;
        }
        query.serverSideFilter = me.dataFilter;
        me.dataSource.getData(query).then(dH=>{
          drawCallback({data:dH.data,recordsTotal:dH.total,recordsFiltered:dH.total});
        }, error => {
          drawCallback({data:[]});
        });
      },
      pageLength: this.pageSize?this.pageSize:10,
      keys: this.navigatable,
      columns: !this.columns?[] : _.map(this.columns,c=>{
        return {
          data:c.field,
          defaultContent:'',
          title:c.title?c.title:c.field,
          type: c.format,
          render: c.format? (data, type, full, meta) => {
            return FormatValueConverter.format(data, this.columns[meta.col].format);
          }:{}
        };
      })
    });
    this.dataTable.on(DT_SELECT_EVENT, (e, d, t, idx) => this.onSelected(idx))
    this.dataTable.on(DT_DESELECT_EVENT, () => this.onDeselected())
    this.dataTable.on(DT_DRAW_EVENT, () => this.handleRedraw());
    this.dataTable.on(DT_KEYFOCUS_EVENT, ()=>this.onFocus());
    this.dataTable.on(DT_DRAW_PAGE, ()=>this.onPageChanged());
    this.dataTable.on(DT_KEY_EVENT, (e, datatable, key, cell, originalEvent)=>this.onKeyPressed(key, cell));

    // handle double ckick
    $(this.gridElement).find("tbody").on('dblclick', 'tr', e => {
      this.onActivated($(e.target.parentNode)[0]._DT_RowIndex);
    });

  }


  createColumns(){
    return this.dataSource.transport.readService.getSchema().then(schema=>{
      this.columns = _.map(schema.fields,f=>{
        return {field: f.field};
      });
    });
  }

  handleRedraw() {
    this.dataTable.rows().deselect();
  }

  onFocus(){
    var cell = this.dataTable.cell({ focused: true });
    if (this.selectedColumnIndex!=cell.index().column) {
      this.selectedColumnIndex = cell.index().column;
      if (this.columns[this.selectedColumnIndex].selectable){
        this.dataTable.column(this.columns[this.selectedColumnIndex].field).select();
        this.dataFieldSelected.raise(this.columns[this.selectedColumnIndex].field);
      }
    }
  }

  onDeselected() {
  }

  onSelected(idx) {
    this.dataSelected.raise(this.dataTable.rows(idx).data()[0]);
  }

  onActivated(idx){
    this.dataActivated.raise(this.dataTable.rows(idx).data()[0]);
  }

  onPageChanged(){
    var info = this.dataTable.page.info();
  }

  onKeyPressed(key, cell){
    if (key===13) { // enter pressed
      this.dataTable.rows('.selected').deselect();
      this.dataTable.row(cell.index().row).select();
    }
  }



  detached(){
    this.dataTable.off(DT_SELECT_EVENT);
    this.dataTable.off(DT_DESELECT_EVENT);
    this.dataTable.off(DT_DRAW_EVENT);
    this.dataTable.destroy();
  }


}
