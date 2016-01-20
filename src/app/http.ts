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
export class CustomHttp extends EventEmitter<any> {
  //private str_: string;

  //get str_() {
  //  console.log('TRACE: str_ has changed', this.str_);
  //  return this.str_;
  //}

  constructor(private http_: Http) {
    super();
     //@Inject(forwardRef(() => Http)) private http_: Http) {
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
    console.log('CustomHTTP GET1 ', url);
    console.log('CustomHTTP GET2 ', options);
  //  let res = this.http_.get(url, options);
  //  console.log('GET res()', res);
  //  return res;
  //    console.log('GET subscribe()');

     return this.http_.get(url, options).subscribe((res: Response) => {
      console.log('GET subscribe()');
      const warn: string = res.headers.get('Warning');
      if (warn) {
        console.log('Received: Warning = ', warn);
      }
    });
  }

  //
  // when the server request has completed
  // we emit the string answer
  //

  public get_error_url(url: string, options?: RequestOptionsArgs) {
    console.log('CustomHTTP GET*1 ', url);
    console.log('CustomHTTP GET*2 ', options);
    this.http_.get(url, options).subscribe(
      (res: Response) => {
        const str = res.text();
        const is_error = (str === '') || (str === null) || (str !== '/error');
        this.emit({url: str, flag: is_error});
      console.log('CustomHTTP GET*3 ', res.text());
    });

  //    next: (res: Response) => {
  //      console.log('NEXT ACTIVATED =', data);
  //      this.error_url_ = data;
  //      if (this.error_url_ === null) {
  //        this.is_error_ = true;
  //      } else {
  //        this.is_error_ = (this.error_url_ !== '/error');
  //      }
  //    }
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