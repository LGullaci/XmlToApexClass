'use restrict';

$(function(){
  $('#formConversao').on('submit',function(e){
    try {
        e.preventDefault();
      var xmlString = $("#txtXml").val();

      var txtNomeClasse = $("#txtNomeClasse");
      console.log(txtNomeClasse);

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

      if(txtNomeClasse.val().length > 40){
        alert("Nome da classe não pode ter mais de 40 caracteres");
        return false;
      }

      var json = Conversor.XmlToApexClass(xmlString, txtNomeClasse.val());
      console.log(json);

      $("#txtClass").html(json);
    //  $('#txtClass').trigger('autoresize');

    }catch(ex){
      console.log(ex);
    }
  })
})
