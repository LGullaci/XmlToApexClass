'use restrict';

window.Conversor = window.Conversor || {};

window.Conversor = (function(window){

  function StringToXml(stringXml){
    return (new DOMParser()).parseFromString(stringXml,'text/xml');
  }

  function verificarObjeto(jsonObject,nomeObjeto,indexPropriedade){
    var objeto = undefined;
    try{

      var propriedades = Object.keys(jsonObject);

      if(indexPropriedade >= propriedades.length)
        return undefined;

      if(propriedades[indexPropriedade] === nomeObjeto)
      {
        objeto = jsonObject[propriedades[indexPropriedade]];
      }
      else
      {
        objeto = this.verificarObjeto(jsonObject[propriedades[indexPropriedade]],nomeObjeto,0);
        objeto = objeto === undefined ? this.verificarObjeto(jsonObject,nomeObjeto,++indexPropriedade) : objeto;
      }

    }catch(ex){
      console.log(ex);
    }

    return objeto;


  }

  function ConvertXmlNodeToJSON(jsonObject,xmlNode){

    var objeto = verificarObjeto(jsonObject,xmlNode.localName,0);

    if(objeto === undefined){

    }
  }

  function getObjectNode(jsonObject,xmlNode){

  }

  function getValueNode(jsonObject,xmlNode){

  }

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
      }

      console.log(json);
      //return json;
    }
  }
})(window);
