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

    // console.log(xmlNode);

    if(xmlNode.children.length === 0){
      jsonObject[xmlNode.localName] = xmlNode.innerHTML;
    }else{
      var objeto = Conversor.verificarObjeto.call(Conversor,this,xmlNode.localName,0);

      if(objeto === undefined){
        var nomeObjeto = (isListNode(xmlNode) ? xmlNode.localName+`_list` : xmlNode.localName);

        jsonObject[nomeObjeto] = {};
        ConvertXmlNodeToJSON.call(this,jsonObject[nomeObjeto],xmlNode.children[0],1);
      }else{

        var propsAntigas = Object.keys(objeto);

        if(xmlNode.children.length === 0){
          objeto[xmlNode.localName] = xmlNode.innerHTML;
        }else{
            //objeto[xmlNode.localName] = {};
            ConvertXmlNodeToJSON.call(this,objeto,xmlNode.children[0],1);
        }

        if(!isListNode(xmlNode)){
          var propsNovas = Object.keys(objeto);

          var novoObjeto = Object.assign({},objeto);

          if(propsAntigas.length !== propsNovas.length){
            var i;
            for( i = 0; i < propsAntigas.length; i++){
              // novoObjeto[propsAntigas[i]] = undefined;
            }


            for( i = propsAntigas.length; i < propsNovas.length; i++){
              // objeto[propsNovas[i]] = undefined;
            }
          }
          jsonObject[xmlNode.localName] = novoObjeto;
        }
      }
    }

    if(index !== undefined){
      ConvertXmlNodeToJSON.call(this,jsonObject,xmlNode.nextElementSibling,index);
    }

  }

  function isListNode(node){

    if(node.children.length > 1){
      return (node.firstElementChild.localName == node.lastElementChild.localName);
    }else if(node.attributes.length > 0){
      var name = node.attributes.name;
      return (typeof name !== 'undefined' && name.nodeValue.search('list') > -1) ;
    }
    return false;
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

      var dia;
      var mes;
      var ano;
      var hora ;
      var minuto ;
      var segundo ;

      var dataFormatada
      if(value.length < 9){
        dia = value.substring(6, 8);
        mes = value.substring(4, 6);
        ano = value.substring(0, 4);
        dataFormatada = Date.parse(`${ano}-${mes}-${dia}`);

      } else if(value.length>=14){
        dia = value.substring(6, 8);
        mes = value.substring(4, 6);
        ano = value.substring(0, 4);
        hora = value.substring(8, 10);
        minuto = value.substring(10, 12);
        segundo = value.substring(12, 14);

        dataFormatada = Date.parse(`${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`);
      }


      // console.log()


      if(!isNaN(dataFormatada)){
          tipo = 'DateTime'
      }else if (value.length > 9){
        tipo = 'Long';
      }else{
        tipo = Number.isSafeInteger(parseFloat(value)) ?
           'Integer':
           'Decimal';
      }

    }else if(value == 'true' || value == 'false'){
      tipo = 'Boolean';
    }else if(typeof value === 'object'){
        tipo = 'Objeto';
    }else {



      tipo = 'String';
    }

    return tipo;

  }

  function JsonToApexClass(json,className,classes,primaryClass = false){

    var propsKey = Object.keys(json);

    var props = [];

    for(var i = 0; i < propsKey.length; i++){
      var prop = {};

      prop.name = propsKey[i].replace('_list','');
      prop.type = checkValueType(json[propsKey[i]]);
      prop.classString = '';

      if(prop.type === 'Objeto'){

        prop.type = getClassName(propsKey[i].replace('_list',''));
        if(className.search('_list') > -1)
          prop.type += '[]';

        prop.classString = JsonToApexClass(json[propsKey[i]],propsKey[i],classes);

        var classeExistente = classes.find(function(c){
          if(c.name === getClassName(propsKey[i])){
            return c;
          }
        });

        if(classeExistente == undefined)
          classes.push({name:getClassName(propsKey[i]),classString:prop.classString});

      }

      props.push(prop);

    }
    return generateApexClass(getClassName(className.replace('_list','')),props,primaryClass,classes);

  }

  function generateApexClass(className,props,primaryClass,classes){

    var formatedProps = props.map(function(prop){
      return `\tpublic ${prop.type} ${prop.name} {get;set;}`;
    });


    var formatedClass = [];

    if(primaryClass){
      formatedClass  = classes.map(function(c){
       return c.classString;
      });
    }

    return `
public ${(primaryClass? 'with sharing' : '')} class ${className}
{
${formatedProps.toString().replace(/,/g,'<br/>')}

${formatedClass.toString().replace(/,/g,'<br/>')}
}
    `;

  }

  function getClassName(name){
    return name.replace(/\b\w/g, (l) => l.toUpperCase() );
  }

  return{
    XmlToApexClass:function(xmlString, nomeClasse){

      var stringClass = '';

      var jsonObject = this.XmlToJson(xmlString);
      console.log(jsonObject);

      var classePai = Object.keys(jsonObject.Envelope.Body)[0];

      var jsonClassePai =  jsonObject.Envelope.Body[classePai];

      var classesApex = [];
      // Primeiro parametro é o contexto da funcao que vai executar.
      return JsonToApexClass(jsonClassePai,nomeClasse,classesApex,true);

//       stringClass = `
// public with sharing class ${nomeClasse}
// {
//
// }
//       `;

      // return stringClass;

    },

    XmlToJson:function(xmlString){
      var json = {};
      var xmlDocument = StringToXml(xmlString);

      var envelope = xmlDocument.documentElement;

      json.namespaces = [];
      // console.log(xmlDocument);
      getAttributes(json,envelope);

      var len = 0;

      var bodyXML = envelope.querySelector('Body');
      // console.log(bodyXML.children);

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

        if(propriedades[indexPropriedade].replace('_list','') === nomeObjeto)
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
