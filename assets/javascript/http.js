/**
 * EasyHTTP Library
 * Library for making HTTP requests
 *
 * @version 2.0.0
 * @author  Darrem Kay
 * @license MIT
 *
 **/

 class EasyHTTP {

     //Make an HTTP GET Request
     async get(url){
        const response = await fetch(url); 
        const resData = await response.json();
        return resData;
     }
    
 } //END OF EasyHTTP Class

const http = new EasyHTTP();
