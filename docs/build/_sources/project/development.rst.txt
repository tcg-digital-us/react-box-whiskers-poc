
`<- Go Back`__

.. _Back: ../index.html

__ Back_

Development
-----------

This project requires 3 major components:

* First is Elasticsearch itself. We don't need to modify it in any way, we just need to configure and run
  the most recent stable Elasticsearch executable available.

* The second component is a back-end server that connects with Elasticsearch and allows us to send it queries
  through whatever API calls we define. 

* The third and final componnent is the front-end, our React application itself, 
  which we will connect to Elasticsearch by using the API we design for our back-end.

This project is designed to create a minimum viable proof of concept, so only the 
API calls required that help us build our specific graph will be defined, but by the
end of this, you should be able to design any other API calls you might need after.

This guide was created within Windows WSL Ubuntu, so it should work easily for
Linux or WSL, where you may have to make some modifications to this process when
working on MacOS.

All of the final code for this project is available alongside the documentation in 
our `GitHub repository <https://github.com/tcg-digital-us/react-vega-elasticsearch>`_.

.. raw:: html

   <center>

`Start setting up Elasticsearch ->`__

.. _Next: ./development/elasticsearch-setup.html

__ Next_

.. raw:: html

   </center>

.. toctree::
   :maxdepth: 10
   :caption: Development:

   development/elasticsearch-setup
   development/create-backend
   development/create-react
   development/create-vega
   development/define-api
   development/load-data
   development/integrate-vega-elasticsearch
   development/vega-form
   development/final-touches

