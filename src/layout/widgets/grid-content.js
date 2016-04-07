import {WidgetContent} from './widget-content';
import {Query} from './../../data/query'
import $ from 'jquery';
import * as _ from 'lodash';
import kendo from 'kendo-ui';

export class GridContent extends WidgetContent {
  constructor(widget) {
    super(widget);
    this.columns = this.settings.columns? this.settings.columns : [];
    this.navigatable = this.settings.navigatable;
    this.autoGenerateColumns = this.settings.autoGenerateColumns;
    
    var self = this;
    this._gridDataSource = new kendo.data.DataSource({
      type: "json",
      pageSize: self.widget.settings.pageSize ? self.widget.settings.pageSize : 20,
      serverPaging: true,
      serverSorting: true,
      group: self.widget.settings.group,
      transport: {
        read: options=> {
          if (self.widget.dataSource){
            var query = new Query();
            query.sort = options.data.sort;
            query.take = options.data.take;
            query.skip = options.data.skip;
            query.serverSideFilter = self.widget.dataFilter;
            self.widget.dataSource.getData(query).then(dH=>{
              this.data = dH.data;
              options.success(dH);
            }, error => {
              this.data = [];
              options.success({total:0,data:[]});
            });
          }
          else
            options.error();
        }
      },
      schema: {
        type: "json",
        data: "data",
        total: "total"
      }
    });
  }


  get selectedCol(){
    return this._selectedCol;
  }
  set selectedCol(value){
    this._selectedCol = value;
  }

  get selectedRow(){
    return this._selectedRow;
  }
  set selectedRow(value){
    this._selectedRow = value;
  }

  set columns(value){
    this._columns = value;
  }
  get columns(){
    return this._columns;
  }

  get autoGenerateColumns(){
    return this._autoGenerateColumns;
  }
  set autoGenerateColumns(value){
    this._autoGenerateColumns = value;
  }


  get data(){
    return this._data;
  }
  set data(value){
    this._data = value;
  }

  get kendoGrid(){

  }

  refresh(){
    this.destroyGrid();
    if (this.autoGenerateColumns)
      this.columns = [];
    this.createGrid();
    this._gridDataSource.read().then(x=>{
    });
  }

  attached() {
    this.restoreState();
    this.createGrid();
    this._gridDataSource.read();

  }

  destroyGrid(){
    if ($(this.gridElement).data("kendoGrid"))
      $(this.gridElement).data("kendoGrid").destroy();
    $(this.gridElement).empty()


  }
  createGrid(){
    var me = this;
    me._grid = $(this.gridElement).kendoGrid({
      dataSource: this._gridDataSource,
      autoBind: false,
      groupable: true,
      height: this._calculateHeight(this.gridElement),
      sortable: true,
      scrollable: {
        virtual: true
      },
      selectable: "row",
      pageable: {
        numeric: false,
        previousNext: false,
        messages: {
          display: "{2} data items"
        }
      },
      /*filterable: {
        mode: "row"
      },*/
      navigatable: true, //this.navigatable,
      navigate: e => {
        // select the entire row
        var row = $(e.element).closest("tr");
        var colIdx = $("td,th", row).index(e.element);
        var dataColIdx = $("td[role='gridcell']", row).index(e.element);
        var col;
        if (me.columns)
          col = me.columns[dataColIdx];
        if ((col)&&(col.selectable)) {
          if (col!=this.selectedCol) {
            $(me.gridElement).find('th').removeClass("col-selected")
            var th = $(me.gridElement).find('th').eq(colIdx);
            th.addClass("col-selected");
            this.selectedCol = col;
            me.onColumnSelected(col.field);
          }
        }
        else
          $(me.gridElement).find('th').removeClass("col-selected");
        me._grid.data("kendoGrid").select(row);
      },
      columnMenu:true,
      columnMenuInit: e=> {
        var menu = e.container.find(".k-menu").data("kendoMenu");
        var field = e.field;
        menu.remove($(menu.element).find('li:contains("Columns")'));
        menu.append({ text: "Columns" });
        menu.bind("select", x=> {
          if ($(x.item).text() == "Columns") {
            $(me.columnsChooserPopup).modal('show');
          }
        });
      },
      columns: this.columns,
      change: e => {
        var selectedRows = me._grid.data("kendoGrid").select();
        if(selectedRows.length == 0 )
          return;
        if (this.selectedRow != me._grid.data("kendoGrid").dataItem(selectedRows[0])){
          this.selectedRow = me._grid.data("kendoGrid").dataItem(selectedRows[0]);
          me.onSelected(this.selectedRow);
        }
      },
      dataBound: e=> {
        $(me.gridElement).find("tr[data-uid]").dblclick(e=> {
          var selectedData = me._grid.data("kendoGrid").select()
          me.onActivated(me._grid.data("kendoGrid").dataItem(selectedData[0]));
        });
      }
    });

  }

  /*resreshColumns(columnsSet){
    if ($(this.gridElement).data("kendoGrid")) {
      for (let fld of columnsSet) {
        var c = _.find(this.columns, {'field': fld.field});
        if (!c)
          self.columns.push({field: fld.field, hidden: true});
        else if ((!c.hidden) && (!c.format))
          c.format = this.getColumnFormat(c.field, fld.type);
      }
      $(this.gridElement).data("kendoGrid").setOptions({
        columns: this.columns
      });
    }
  }*/


  saveState(){
    this.widget.state = {columns:this.columns};
  }

  restoreState(){
    if (this.widget.state)
      this.columns = this.widget.state.columns;
  }

  onColumnSelected(colName){
    this.widget.dataFieldSelected.raise(colName);
  }

  onActivated(dataItem){
    var currentRecord = new Map();
    _.forOwn(dataItem, (v, k)=>{
      currentRecord.set(k,v);
    })
    this.widget.dataActivated.raise(currentRecord);
  }

  onSelected(dataItem){ // assuming single row select for now
    var currentRecord = new Map();
    _.forOwn(dataItem, (v, k)=>{
      currentRecord.set(k,v);
    })
    this.widget.dataSelected.raise(currentRecord);
  }



  getColumnFormat(columnName, type){
    switch (type){
      case "date":
        return "{0:MMM.dd yyyy}";
      case "currency":
        return "{0:n2}";
      default:
        return "";
    }
  }

  /// Columns chooser
  get columnsFilterExpression(){
    return this._columnsFilterExpression;
  }
  set columnsFilterExpression(value){
    this._columnsFilterExpression = value;
  }

  get filteredColumns(){
    if (this.columnsFilterExpression)
      return _.filter(this.columns, x => (x.field.toLowerCase().indexOf(this.columnsFilterExpression.toLowerCase())==0));
    return this.columns;
  }


  selectColumn(column){
    var c = _.find(this.columns, {"field": column.field});
    c.hidden=(!c.hidden);
    if (!c.format)
      c.format = this.getColumnFormat(c.field, this._gridDataSource.data());
    if (c.hidden)
      $(this.gridElement).data("kendoGrid").hideColumn(c.field);
    else
      $(this.gridElement).data("kendoGrid").showColumn(c.field);


    this.saveState();
    return true;
  }
  /// End columns chooser
}
