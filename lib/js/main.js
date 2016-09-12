'use restrict';

$(function(){
  $('#formConversao').on('submit',function(e){
    try {
        e.preventDefault();
      //$("#blockUI").toggle();
      var xmlString = $("#txtXml").val();

      $("#txtClass").val(xmlString);
      $('#txtClass').trigger('autoresize');

      //console.log(
    // Conversor.XmlToJson(xmlString)
      //$("#blockUI").toggle();
      //);

      var json = {
        foo:{

          a:{
            id:1
          },
          foobar:{
            id:2,
            teste:{
              shortDesc:'Desc'
            },
            name:'a'
          }
        }
      }

      var objeto = Conversor.verificarObjeto(json,"teste",0);
      console.log(objeto);

    }catch(ex){
      console.log(ex);
    }
  })
})
