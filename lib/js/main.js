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
          foobar:{
            id:2,
            teste:{
              shortDesc:'Desc'
            },
            name:'a'
          },
          a:{
            id:1
          }
        }
      }

      var objeto = Conversor.verificarObjeto(json,"teste");
      console.log(objeto);

    }catch(ex){
      console.log(ex);
    }
  })
})
