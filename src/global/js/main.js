
require.config({
    paths:{
        jquery:"plugin/jquery.min"
    }
});
   require(['jquery'],function () {
       $(document).ready(function(){
           //$()
           console.log(document.body.scrollHeight);
       })

   });