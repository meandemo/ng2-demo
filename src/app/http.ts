import {Injectable, EventEmitter,
         Inject, forwardRef}       from 'angular2/core';

import {HTTP_PROVIDERS,
        Http,
        Response,
        ConnectionBackend,
        Request,
        RequestOptions,
        RequestOptionsArgs,
        RequestMethod, }  from 'angular2/http';

/*
export class CustomHttp extends Http {

  constructor(backend_: ConnectionBackend, defaultOptions_: RequestOptions) {
    super(backend_, defaultOptions_);
    console.log('CustomHTTP constructor');
  }

  public request(url: string | Request, options?: RequestOptionsArgs) {
    console.log('CustomHTTP REQ ', url);
    return super.request(url, options).do((res: Response) => {
      console.log('REQ do()');
      const warn: string = res.headers.get('Warning');
      if (warn) {
        console.log('Received: Warning = ', warn);
      }
    });
  }

  public get(url: string, options?: RequestOptionsArgs) {
    console.log('CustomHTTP GET1 ', url);
    console.log('CustomHTTP GET2 ', options);
    let res = super.get(url, options);
    console.log('GET res()', res);
    return res;
  }
}

*/
//              @Inject(forwardRef(() => SliderDemoService)) private slider_demo_service_: SliderDemoService ) {

@Injectable()
export class CustomHttp {
  //private str_: string;

  //get str_() {
  //  console.log('TRACE: str_ has changed', this.str_);
  //  return this.str_;
  //}

  constructor(private http_: Http) {
    // super();
    // @Inject(forwardRef(() => Http)) private http_: Http) {
    console.log('CustomHTTP constructor');
  }

  public request(url: string | Request, options?: RequestOptionsArgs) {
    console.log('CustomHTTP REQ ', url);
    return this.http_.request(url, options).do((res: Response) => {
      console.log('REQ do()');
      const warn: string = res.headers.get('Warning');
      if (warn) {
        console.log('Received: Warning = ', warn);
      }
    });
  }

  public get(url: string, options?: RequestOptionsArgs) {
    // console.log('CustomHTTP GET1 ', url);
    // console.log('CustomHTTP GET2 ', options);
  //  let res = this.http_.get(url, options);
  //  console.log('GET res()', res);
  //  return res;
  //    console.log('GET subscribe()');

     return this.http_.get(url, options).subscribe((res: Response) => {
      // console.log('GET subscribe()');
      const warn: string = res.headers.get('Warning');
      if (warn) {
        // console.log('Received: Warning = ', warn);
      }
    });
  }


  public get_error_url() {
    let error_api = 'api/public/v1/errorurl';
    // console.log('CustomHTTP GET*1 ', error_api);
    return this.http_.get(error_api, null);
  }

  public post(url: string, body: string, options?: RequestOptionsArgs) {
    return this.http_.post(url, body, options);
  }

  public put(url: string, body: string, options?: RequestOptionsArgs) {
    console.log('CustomHTTP PUT ', url);
    return this.http_.put(url, body, options);
  }

  public delete(url: string, options?: RequestOptionsArgs) {
    return this.http_.delete(url, options);
  }

  public patch(url: string, body: string, options?: RequestOptionsArgs) {
    return this.http_.patch(url, body, options);
  }

  public head(url: string, options?: RequestOptionsArgs) {
    return this.http_.head(url, options);
  }
}