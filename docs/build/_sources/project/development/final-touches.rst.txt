
CSS Styling and Cleaning Up
~~~~~~~~~~~~~~~~~~~~~~~~~~~

I will just provide the CSS styling here that will make it look like the picture
displayed on the first page of this tutorial. These CSS properties just need to
be pasted into App.css after the properties that React has already created:

.. code:: CSS 
 
   #graph_card {
     width: 75%;
     color: black;
     background: white;
     padding: 40px 20px 60px 20px;
     border-radius: 10px;
     filter: drop-shadow(0px 0px 10px black);
     font-size: 12pt;
   }

   .penguin_form {
     text-align: left;
     width: 75%;
     margin: 0 auto;
     padding-top: 20px;
   }

   .penguin_form_text_input {
     width: calc(100% - 8px);
   }

   #title_header {
     width: 75%;
   }

   #penguin_form_submit {
     margin-top: 20px;
   }

   #elastic_response {
     text-align: left;
     margin-top: 50px;
     margin-bottom: 20px;
     font-size: 12px;
     color: grey;
   }

   #graph_container {
     position: relative;
     display: block;
     width: 75%;
     margin: 0 auto;
   }

   #Graph {
     width: 100%;
     padding-left: 30px;
   }