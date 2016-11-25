'use restrict';

window.Conversor = window.Conversor || {};

window.Conversor = (function(window){

  var palavrasReservadas = ["Account"];

  function StringToXml(stringXml){
    return (new DOMParser()).parseFromString(stringXml,'text/xml');
  }

  function ConvertXmlNodeToJSON(jsonObject,xmlNode,index){


    if(xmlNode === undefined || xmlNode === 'null' || xmlNode === null){
      return;
    }

    console.log(xmlNode);

    if(xmlNode.children.length === 0){
      jsonObject[xmlNode.localName] = xmlNode.innerHTML;
    }else{
      var objeto = Conversor.verificarObjeto.call(Conversor,this,xmlNode.localName,0);

      if(objeto === undefined){

        jsonObject[xmlNode.localName] = {};
        ConvertXmlNodeToJSON.call(this,jsonObject[xmlNode.localName],xmlNode.children[0],1);
      }else{

        var propsAntigas = Object.keys(objeto);

        if(xmlNode.children.length === 0){
          objeto[xmlNode.localName] = xmlNode.innerHTML;
        }else{
            //objeto[xmlNode.localName] = {};
            ConvertXmlNodeToJSON.call(this,objeto,xmlNode.children[0],1);
        }

        var propsNovas = Object.keys(objeto);

        var novoObjeto = Object.assign({},objeto);

        if(propsAntigas.length !== propsNovas.length){
          var i;
          for( i = 0; i < propsAntigas.length; i++){
            novoObjeto[propsAntigas[i]] = undefined;
          }


          for( i = propsAntigas.length; i < propsNovas.length; i++){
            objeto[propsNovas[i]] = undefined;
          }
        }
        jsonObject[xmlNode.localName] = novoObjeto;
      }
    }

    if(index !== undefined){
      ConvertXmlNodeToJSON.call(this,jsonObject,xmlNode.nextElementSibling,index);
    }

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

  function checkValueType(value){
    var tipo;

    if(!isNaN(value)){

      tipo = Number.isSafeInteger(parseFloat(value)) ?
         'Integer':
         'Decimal';
    }else if(value == 'true' or value == 'false'){
      tipo = 'Boolean';
    }else if(typeof value === 'object'){
        tipo = 'Objeto';
    }else {
      tipo = 'String';
    }

    return tipo;

  }

  function JsonToApexClass(json,className){

  }

  function getClassName(name){
    return name.replace(/\b\w/g, function(l){ return l.toUpperCase() });
  }

  return{
    XmlToApexClass:function(xmlString, nomeClasse){

      var stringClass = '';

      var jsonObject = this.XmlToJson(xmlString);

      var classePai = Object.keys(jsonObject.Envelope.Body)[0];

      var jsonClassePai =  jsonObject.Envelope.Body[classePai];

      var

      stringClass = `
public with sharing class ${nomeClasse}
{

}
      `;

      return stringClass;

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
      console.log(bodyXML.children);

      len = bodyXML.children.length

      json.Envelope = {};

      ConvertXmlNodeToJSON.call(json.Envelope,json.Envelope,bodyXML);

      return json;
    },
    verificarObjeto:function(jsonObject,nomeObjeto,indexPropriedade){
      var objeto = undefined;

      try{

        if(jsonObject === undefined)
        return undefined;

        var propriedades = Object.keys(jsonObject);
      //  console.log(propriedades);
        if(indexPropriedade >= propriedades.length || typeof jsonObject !== 'object')
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
  }
})(window);
