'use restrict';

window.Conversor = window.Conversor || {};

window.Conversor = (function(window){

  function StringToXml(stringXml){
    return (new DOMParser()).parseFromString(stringXml,'text/xml');
  }

  function verificarObjeto(jsonObject,nomeObjeto){

    var objeto = undefined;

    var propriedades = Object.keys(jsonObject);

    var i = 0;
    do {
      if(typeof jsonObject[propriedades[i]] === 'object'){
        if(propriedades[i] === nomeObjeto){
          objeto = jsonObject[propriedades[i]];
        }else{
          objeto = verificarObjeto(jsonObject[propriedades[i]],nomeObjeto);
        }
      }
      i++;
    } while (objeto !== undefined && i < propriedades.length);


    return objeto;

  }

  // function getNode(jsonObject,xmlNode){
  //   if(xmlNode === null)
  //     return;
  //
  //   if(xmlNode.children.length > 0){
  //
  //     getNode();
  //   }else {
  //     getNode(jsonObject)
  //   }
  // }

  function getAttributes(jsonObject,xmlNode){

    try{
      jsonObject.attributes = {};
      jsonObject.attributes.namespaces = {};

      if(xmlNode.attributes.length > 0){

        var attrs = xmlNode.attributes;

        var len  = attrs.length;

        for(var i = 0; i < len; i++ ){

          if(attrs[i].prefix === 'xmlns'){
            jsonObject.attributes.namespaces[attrs[i].localName] = attrs[i].nodeValue;
          }else{
            jsonObject.attributes[attrs[i].localName] = attrs[i].nodeValue;
          }
        }
      }
    }
    catch(ex)
    {
      console.log(ex);
    }
  }

  return{
    XmlToApexClass:function(){

    },

    verificarObjeto:function(jsonObject,nomeObjeto){
      var objeto = undefined;
      try{

        var propriedades = Object.keys(jsonObject);

        var i = 0;
        do {
          if(typeof jsonObject[propriedades[i]] === 'object'){
            if(propriedades[i] === nomeObjeto){
              objeto = jsonObject[propriedades[i]];
            }else{
              objeto = this.verificarObjeto(jsonObject[propriedades[i]],nomeObjeto);
            }
          }
          i++;
        } while (objeto === undefined && i < propriedades.length);
      }catch(ex){
        console.log(ex);
      }

      return objeto;

    },

    XmlToJson:function(xmlString){
      var json = {};
      var xmlDocument = StringToXml(xmlString);

      var envelope = xmlDocument.documentElement;

      json.namespaces = [];
      console.log(xmlDocument);
      getAttributes(json,envelope);

      var len = 0;

      var bodyXML = envelope.querySelector('Body');

      len = bodyXML.children.length

      json.body = {};

      for(var i = 0; i < len ; i++){


        json.body[bodyXML.children[i].localName] = {
          prefix:bodyXML.children[i].prefix,
          attributes: [],
          value:undefined,
          childrens:[]
        }


        getAttributes(json.body[bodyXML.children[i].localName], bodyXML.children[i]);
        console.log('a3');
      }

      console.log(json);
      //return json;
    }
  }
})(window);
