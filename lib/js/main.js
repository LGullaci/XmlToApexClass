'use restrict';

$(function(){
  $('#formConversao').on('submit',function(e){
    try {
        e.preventDefault();
      $("#blockUI").toggle();
      var xmlString = $("#txtXml").val();



      //console.log(
    // Conversor.XmlToJson(xmlString)
      //$("#blockUI").toggle();
      //);

      // var json = {
      //   foo:{
      //
      //     a:{
      //       id:1
      //     },
      //     foobar:{
      //       id:2,
      //       teste:{
      //         shortDesc:'Desc'
      //       },
      //       name:'a'
      //     }
      //   }
      // }

      //var objeto = Conversor.verificarObjeto(json,"teste",0);

      var json = Conversor.XmlToJson(xmlString);
      console.log(json);

      $("#txtClass").val(JSON.stringify(json));
      $('#txtClass').trigger('autoresize');
      $("#blockUI").toggle();

    }catch(ex){
      console.log(ex);
    }
  })
})
