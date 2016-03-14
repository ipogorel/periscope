import {Container, inject} from 'aurelia-framework';
import {Datasource} from './data-source';
import {DataServiceConfiguration} from './data-service';
import {JsonDataService} from './json-data-service';
import {StaticJsonDataService} from './static-json-data-service';
import {CacheManager} from '../cache/cache-manager'
import {MemoryCacheStorage} from '../cache/memory-cache-storage'
import {Factory} from '../infrastructure/factory';

@inject(Factory.of(StaticJsonDataService), Factory.of(CacheManager), MemoryCacheStorage)
export class Repository {

  constructor(dataServiceFactory, cacheManagerFactory, memoryCacheStorage) {
    this._dataServiceFactory = dataServiceFactory;
    this._cacheManagerFactory = cacheManagerFactory;
    this._memoryCacheStorage = memoryCacheStorage;
  }

  getDatasource(name) {
    switch (name.toLowerCase()) {
      case 'customers':
        var config = new DataServiceConfiguration({
          url:'/data/customers.json',
          schema:{
            fields:[
              {
                field:"Id",
                type:"string"
              },
              {
                field:"CompanyName",
                type:"string"
              },
              {
                field:"ContactName",
                type:"string"
              },
              {
                field:"ContactTitle",
                type:"string"
              },
              {
                field:"Address",
                type:"string"
              },
              {
                field:"City",
                type:"string"
              },
              {
                field:"Country",
                type:"string"
              },
              {
                field:"PostalCode",
                type:"string"
              },
              {
                field:"Phone",
                type:"string"
              },
              {
                field:"Fax",
                type:"string"
              }
            ]
          },
          dataMapper: data=>{
            return data.Results
          },
          totalMapper: data=>{
            return data.Results.length
          }
        });
        var jsonDataService = this._dataServiceFactory(config)
        var cacheManager = this._cacheManagerFactory(this._memoryCacheStorage);
        cacheManager.startCleaner();

        return new Datasource({
          name: name,
          cache: {
            cacheTimeSeconds: 120,
            cacheManager: cacheManager
          },
          transport:{
            readService: jsonDataService
          }
        });
      case 'orders':
        var config = new DataServiceConfiguration({
          url:'/data/orders.json',
          schema:{
            fields:[
              {
                field:"Id",
                type:"string"
              },
              {
                field:"CustomerId",
                type:"string"
              },
              {
                field:"EmployeeId",
                type:"string"
              },
              {
                field:"OrderDate",
                type:"date"
              },
              {
                field:"RequiredDate",
                type:"date"
              },
              {
                field:"ShippedDate",
                type:"date"
              },
              {
                field:"ShipVia",
                type:"number"
              },
              {
                field:"Freight",
                type:"number"
              },
              {
                field:"ShipName",
                type:"string"
              },
              {
                field:"ShipAddress",
                type:"string"
              },
              {
                field:"ShipCity",
                type:"string"
              },
              {
                field:"ShipPostalCode",
                type:"string"
              },
              {
                field:"ShipCountry",
                type:"string"
              }
            ]
          },
          dataMapper: data=>{
            return data.Results
          },
          totalMapper: data=>{
            return data.Results.length
          }
        });

        var jsonDataService = this._dataServiceFactory(config)
        var cacheManager = this._cacheManagerFactory(this._memoryCacheStorage);
        cacheManager.startCleaner();

        return new Datasource({
          name: name,
          cache: {
            cacheTimeSeconds: 120,
            cacheManager: cacheManager
          },
          transport:{
            readService: jsonDataService
          }
        });
    }
  }
}
